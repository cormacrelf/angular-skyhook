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
    DropTargetMonitor,
    DragSource, DropTarget
} from "angular-skyhook";
import { DraggedItem, SortableSpec, Size } from "./types";
import { Observable, Subscription } from 'rxjs';

export interface CardRendererContext<Data> {
    data: Data;
    type: string | symbol;
    index: number;
    horizontal: boolean;
    listId: number;
    spec: SortableSpec<Data>;
}

const _scheduleMicroTaskPolyfill: (f: () => void) => any = (
    requestAnimationFrame || webkitRequestAnimationFrame || ((f: () => void) => setTimeout(f, 0))
)

@Directive({
    selector: '[cardRenderer]',
    exportAs: 'cardRenderer'
})
export class CardRendererDirective<Data> implements OnInit, OnDestroy {
    @Input('cardRenderer') context!: CardRendererContext<Data>;

    get data() { return this.context.data; }
    get type() { return this.context.type; }
    get listId() { return this.context.listId; }
    get index() { return this.context.index; }
    get horizontal() { return this.context.horizontal; }

    private get spec() { return this.context.spec; }

    private subs = new Subscription();

    /** @ignore */
    target: DropTarget<DraggedItem<Data>> = this.dnd.dropTarget<DraggedItem<Data>>(null, {
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

    /** @ignore */
    source: DragSource<DraggedItem<Data>> = this.dnd.dragSource<DraggedItem<Data>>(null, {
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

    isDragging$: Observable<boolean> = this.source.listen(m => m.isDragging());

    constructor(
        private dnd: SkyhookDndService,
        private el: ElementRef<HTMLElement>
    ) {
    }

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

    private sameIds = (data: Data, other: DraggedItem<Data>) => {
        return data && other.data && this.spec.trackBy(data) === this.spec.trackBy(other.data);
    }

    private isDragging(item: DraggedItem<Data> | null) {
        const isD = this.spec && this.spec.isDragging || this.sameIds;
        return item && isD(this.data, item) || false;
    }

    //     ~ List ~
    // [
    //   [ index 0 ]
    //   [ index 1 ] <-- index 1 gets picked up
    //   [ index 2 ]
    // ]
    //
    // We want to emit a hover when:
    //   - the mouse moves over the top half of 0
    //   - the mouse moves over the bottom half of 2
    //
    // ,----------------------,
    // | target 0 top half    | => emits 0
    // |----------------------|
    // | target 0 bottom half | => computes 1, doesn't emit
    // '----------------------'
    // ,----------------------,
    // | target 1 (inert)     | => computes 1, doesn't emit
    // '----------------------'
    // ,----------------------,
    // | target 2 top half    | => computes 1, doesn't emit
    // |----------------------|
    // | target 2 bottom half | => emits 2
    // '----------------------'
    //

    hover(item: DraggedItem<Data>, clientOffset: Offset): void {
        // hovering on yourself should do nothing
        if (this.isDragging(item)) {
            return;
        }
        const size = this.size();
        const dim = this.horizontal ? size.width : size.height;
        const start = this.top();
        const targetCentre = start + dim / 2.0;
        const mouse = this.horizontal ? clientOffset.x : clientOffset.y;
        const topHalf = mouse < targetCentre;

        const { hover } = item;

        let suggestedIndex: number;

        if (this.listId === hover.listId) {
            if (this.index < hover.index) {
                suggestedIndex = topHalf ? this.index : this.index + 1;
            } else {
                suggestedIndex = topHalf ? this.index - 1 : this.index;
            }
        } else {
            // first hover on a different list;
            // there is no relevant hover.index to compare to
            suggestedIndex = topHalf ? this.index : this.index + 1;
        }

        // happens if you aren't implementing SortableSpec correctly.
        if (suggestedIndex < 0) {
            // console.warn('this.listId',this.listId, 'hover.listId', hover.listId)
            // suggestedIndex = 0;
            throw new Error("angular-skyhook-sortable: Cannot move a card to an index < 0.");
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
    rect() {
        if (!this.el) {
            throw new Error("angular-skyhook-sortable: cardRenderer expected to be attached to a real DOM element");
        }
        const rect = (this.el.nativeElement as Element).getBoundingClientRect();
        return rect;
    }

    /** @ignore */
    size() {
        return new Size(this.width(), this.height());
    }

    /** @ignore */
    width() {
        const rect = this.rect();
        return rect.width || rect.right - rect.left;
    }

    /** @ignore */
    height() {
        const rect = this.rect();
        return rect.height || rect.bottom - rect.top;
    }

    /** @ignore */
    top() {
        return this.horizontal ? this.rect().left : this.rect().top;
    }

    /** @ignore */
    mouse(monitor: DropTargetMonitor) {
        const offset = monitor.getClientOffset();
        return !!offset && (this.horizontal ? offset.x : offset.y);
    }

    ngOnInit() {
        this.target.setTypes(this.type);
        this.source.setType(this.type);
    }

    ngAfterViewInit() {
        if (this.el) {
            this.target.connectDropTarget(this.el.nativeElement);
        }
    }

    ngOnChanges() {
        this.target.setTypes(this.type);
        this.source.setType(this.type);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
