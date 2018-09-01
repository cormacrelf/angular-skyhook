import {
    Directive,
    Input,
    ElementRef,
    OnChanges,
    OnDestroy
} from "@angular/core";
import {
    SkyhookDndService,
    DragSource
} from "@skyhook/core";
import { DraggedItem, SortableSpec, Size } from "../types";
// @ts-ignore
import { Observable, Subscription } from 'rxjs';

export const EXTERNAL_LIST: symbol = Symbol("EXTERNAL_LIST");


@Directive({
    selector: '[ssExternal]',
    exportAs: 'ssExternal'
})
export class SkyhookSortableExternal<Data> implements OnChanges, OnDestroy {
    @Input('ssExternal') spec!: SortableSpec<Data>;

    public source: DragSource<DraggedItem<Data>> = this.dnd.dragSource<DraggedItem<Data>>(null, {
        beginDrag: () => {
            if (typeof this.spec.createData !== 'function') {
                throw new Error("spec.createData must be a function");
            }
            return {
                type: this.spec.type,
                data: this.spec.createData(),
                hover: { index: 0, listId: EXTERNAL_LIST },
                isInternal: false,
                index: 0,
                listId: EXTERNAL_LIST,
                size: this.size(),
            }
        },
        endDrag: monitor => {
            const item = monitor.getItem();
            if (item) {
                this.spec && this.spec.endDrag && this.spec.endDrag(item);
            }
        }
    });

    constructor(
        private dnd: SkyhookDndService,
        private el: ElementRef<Element>
    ) {}

    /** @ignore */
    private size() {
        const rect = this.el.nativeElement.getBoundingClientRect();
        return new Size(
            rect.width || rect.right - rect.left,
            rect.height || rect.bottom - rect.top
        );
    }

    /** @ignore */
    ngOnChanges() {
        this.source.setType(this.spec.type);
    }
    /** @ignore */
    ngOnDestroy() {
        this.source.unsubscribe();
    }

}
