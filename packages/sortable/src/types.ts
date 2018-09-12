import { Observable } from 'rxjs';

export interface SortableSpec<Data, Type = string|symbol> {
    /** The underlying @angular-skyhook/core / dnd-core type. */
    type: Type;

    /** Used for external data sources only.
     *
     * Must produce a new object, with some Data which will be unique for the given trackBy function. */
    createData?: () => Data;

    /** Required. Must produce a different value for every available Data.
     *  Usually, this will be `data => data.id`. */
    trackBy: (data: Data) => any;

    /** Optional if you provided `[ssSortableChildren],` otherwise required.
     *  NOTE: return an Observable! If you don't have one already, use `[ssSortableChildren]`.
     *  A typical use is with an @ngrx/store: `getList: _listId => this.store.select(...)` */
    getList?: (listId: any) => Observable<Iterable<Data> | undefined>;

    /** Optional; some implementations do not need beginDrag. */
    beginDrag?: (item: DraggedItem<Data>) => void;

    /** Required; must cause list backing the sortable to move item.data under the cursor. */
    hover: (item: DraggedItem<Data>) => void;

    /** Required; because if you don't have a drop function, what are you even doing? */
    drop: (item: DraggedItem<Data>) => void;

    /** Required; you must reset and remove any temporarily added data from the drag. */
    endDrag: (item: DraggedItem<Data>) => void;

    /** Optional; you may override the default 'same trackBy' implementation. */
    isDragging?: (ground: Data, inFlight: DraggedItem<Data>) => boolean;

    /** Optional; you may override default `() => true`. */
    canDrag?: (data: Data, listId: any) => boolean;

    /** Optional; you may override default `() => true`.
     *  Inspect `item.hover` for where it is hovering. */
    canDrop?: (item: DraggedItem<Data>) => boolean;

}

export class Size {
    constructor(public width: number, public height: number) {}
    style() {
        return {
            width: this.width + "px",
            height: this.height + "px"
        };
    }
}

export interface DraggedItem<Data> {
    data: Data;
    size: Size;
    type: string|symbol;
    index: number;
    listId: any;
    isInternal?: boolean;
    // isCopy?: boolean;
    hover: {
        index: number;
        listId: any;
    }
}
