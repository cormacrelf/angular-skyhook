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
            return item && this.hasSameIdAs(item) || false;
        },
        beginDrag: () => {
            let item: DraggedItem<Data> = {
                data: this.data,
                index: this.index,
                isCopy: false,
                size: this.size(),
                type: this.type,
                isInternal: true,
                listId: this.listId,
                hover: {
                    index: this.index,
                    listId: this.listId
                }
            };
            // if (this.spec && this.spec.copy && this.spec.copy(item)) {
            //     if (!this.spec.clone) {
            //         throw new Error("must provide clone function");
            //     }
            //     let clone = this.spec.clone(item.data);
            //     if (clone !== item.data || this.sameIds(item.data, clone)) {
            //         throw new Error("clone must return a new object with a different id / trackBy result");
            //     }
            //     item.data = clone;
            //     item.hover.index ++;
            //     item.isCopy = true;
            // }
            this.spec && this.spec.beginDrag && this.spec.beginDrag(item);
            // if (item.isCopy) {
            //     // Chrome bug means an immediate dragend would fire
            //     // if you did this synchronously
            //     let canDrop = true;
            //     if (this.spec && this.spec.canDrop) {
            //         canDrop = this.spec.canDrop(item);
            //     }
            //     if (canDrop) {
            //         setTimeout(() => {
            //             this.spec && this.spec.hover && this.spec.hover(item);
            //         }, 0);
            //     }
            // }
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

    sameIds(data: Data, other: Data) {
        return data && other && this.spec.trackBy(data) === this.spec.trackBy(other);
    }

    hasSameIdAs(item: DraggedItem<Data>) {
        return this.sameIds(this.data, item.data);
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
        if (this.hasSameIdAs(item)) {
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

        // happens if you're copying from index=0
        if (suggestedIndex < 0) {
            // console.warn('this.listId',this.listId, 'hover.listId', hover.listId)
            // suggestedIndex = 0;
            throw new Error("angular-skyhook-sortable: tried to move a card to an index < 0");
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
            throw new Error("cardRenderer expected to be attached to a real DOM element");
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
