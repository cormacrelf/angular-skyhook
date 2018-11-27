import {
    Directive,
    Input,
    ElementRef,
    OnInit,
    OnDestroy
} from "@angular/core";
import {
    SkyhookDndService,
    Offset,
    DragSource,
    DropTarget
} from "@angular-skyhook/core";
import { DraggedItem, Size, RenderContext } from "../types";
import { Observable, Subscription } from 'rxjs';
import { getSuggester } from '../hoverTriggers';

/** @ignore */
const _scheduleMicroTaskPolyfill: (f: () => void) => any = (
    requestAnimationFrame || webkitRequestAnimationFrame || ((f: () => void) => setTimeout(f, 0))
)

@Directive({
    selector: '[ssRender]',
    exportAs: 'ssRender'
})
export class SkyhookSortableRenderer<Data> implements OnInit, OnDestroy {
    @Input('ssRender') context!: RenderContext<Data>;

    get data() { return this.context.data; }
    /** @ignore */
    private get type() { return this.context.spec && this.context.spec.type; }
    /** @ignore */
    private get listId() { return this.context.listId; }
    /** @ignore */
    private get index() { return this.context.index; }

    /** @ignore */
    private get spec() { return this.context.spec; }

    /** @ignore */
    private subs = new Subscription();

    /** This DropTarget is attached where [ssRender] is.
     *
     * It is responsible for triggering {@link SortableSpec.hover} when the place you are hovering changes.
     */
    target: DropTarget<DraggedItem<Data>>;

    /** This DragSource is NOT attached for you.
     *
     *  You need to attach it yourself, by pulling #render="ssRender", and applying [dragSource]="render.source".
     */
    source: DragSource<DraggedItem<Data>>;

    /**
     * Shortcut for `this.source.listen(m => m.isDragging())`
     *
    */
    isDragging$: Observable<boolean>;

    /** @ignore */
    constructor(
        private dnd: SkyhookDndService,
        private el: ElementRef<HTMLElement>
    ) {
        this.target = this.dnd.dropTarget<DraggedItem<Data>>(null, {
            // this is a hover-only situation
            canDrop: () => false,
            hover: monitor => {
                const item = monitor.getItem();
                const offset = monitor.getClientOffset();
                if (item && offset) {
                    this.hover(item, offset);
                }
            }
        }, this.subs);

        this.source = this.dnd.dragSource<DraggedItem<Data>>(null, {
            isDragging: monitor => {
                const item = monitor.getItem();
                return this.isDragging(item);
            },
            beginDrag: () => {
                const item = this.createItem();

                // Chromium bug since 2016: if you modify styles or DOM
                // synchronously within 'dragstart' handler, Chrome fires
                // a 'dragend' immediately.
                //
                // https://bugs.chromium.org/p/chromium/issues/detail?id=674882
                // although recommended Promise.resolve().then() doesn't work.
                this.spec && this.spec.beginDrag && _scheduleMicroTaskPolyfill(() => {
                    this.spec && this.spec.beginDrag && this.spec.beginDrag(item);
                });

                return item;
            },
            endDrag: monitor => {
                const item = monitor.getItem();
                if (item) {
                    this.spec && this.spec.endDrag && this.spec.endDrag(item);
                }
            }
        }, this.subs);

        this.isDragging$ = this.source.listen(m => m.isDragging());

    }

    /** @ignore */
    private createItem(): DraggedItem<Data> {
        return {
            data: this.data,
            index: this.index,
            size: this.size(),
            type: this.type,
            isInternal: true,
            listId: this.listId,
            hover: {
                index: this.index,
                listId: this.listId
            }
        };
    }

    /** @ignore */
    private sameIds = (data: Data, other: DraggedItem<Data>) => {
        return data && other.data && this.spec.trackBy(data) === this.spec.trackBy(other.data);
    }

    /** @ignore */
    private isDragging(item: DraggedItem<Data> | null) {
        const isD = this.spec && this.spec.isDragging || this.sameIds;
        return item && isD(this.data, item) || false;
    }

    /** @ignore */
    private hover(item: DraggedItem<Data>, clientOffset: Offset): void {
        // hovering on yourself should do nothing
        if (this.isDragging(item)
            && this.index === item.hover.index
            && this.listId === item.hover.listId) {
            return;
        }
        const { hover } = item;
        let suggester = getSuggester(this.context.hoverTrigger);
        let suggestedIndex = suggester(
            this.context,
            item,
            this.rect(),
            clientOffset
        );

        // happens if you aren't implementing SortableSpec correctly.
        if (suggestedIndex < 0) {
            // console.warn('this.listId',this.listId, 'hover.listId', hover.listId)
            // suggestedIndex = 0;
            throw new Error("@angular-skyhook/sortable: Cannot move a card to an index < 0.");
        }

        // move the item if its new position is different
        if (suggestedIndex !== hover.index || this.listId !== hover.listId) {
            item.hover = {
                index: suggestedIndex,
                listId: this.listId
            };
            if (this.spec && this.spec.canDrop && !this.spec.canDrop(item)) {
                return;
            }
            // shallow clone so library consumers don't mutate our items
            this.spec && this.spec.hover && this.spec.hover({
                ...item
            });
        }

    }

    /** @ignore */
    private rect() {
        if (!this.el) {
            throw new Error("@angular-skyhook/sortable: [ssRender] expected to be attached to a real DOM element");
        }
        const rect = (this.el.nativeElement as Element).getBoundingClientRect();
        return rect;
    }

    /** @ignore */
    private size() {
        const rect = this.rect();
        const width = rect.width || rect.right - rect.left;
        const height = rect.height || rect.bottom - rect.top;
        return new Size(width, height);
    }

    /** @ignore */
    ngOnInit() {
        this.target.setTypes(this.type);
        this.source.setType(this.type);
    }

    /** @ignore */
    ngAfterViewInit() {
        if (this.el) {
            this.target.connectDropTarget(this.el.nativeElement);
        }
    }

    /** @ignore */
    ngOnChanges() {
        this.target.setTypes(this.type);
        this.source.setType(this.type);
    }

    /** @ignore */
    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
