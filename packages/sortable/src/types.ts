import { Observable } from 'rxjs';
import {DropTargetMonitor, DragSourceMonitor} from '@angular-skyhook/core';

export interface SortableSpec<Data, Type = string|symbol> {
    /** The underlying @angular-skyhook/core / dnd-core type.
     * String or symbol, if that's not clear from the documentation output.. */
    type: Type;

    /** By default, a sortable accepts the type it produces. But you could have
     * it accept more types. Be sure to include `type` if you want to sort a
     * list within itself.
     *
     * This opens up other possibilities: if you set `type` to `"A"` but
     * `accepts` to `"B"`, you could allow dragging `"B"`s into it but not
     * sorting within the list. */
    accepts?: string | symbol | (string | symbol)[];

    /** Used for external data sources only.
     *
     * Must produce a new object, with some Data which will be unique for the given trackBy function. */
    createData?(): Data;

    /** Required. Must produce a different value for every available Data.
     *  Usually, this will be `data => data.id`. */
    trackBy(data: Data): any;

    /** Optional if you provided `[ssSortableChildren],` otherwise required.
     *  NOTE: return an Observable! If you don't have one already, use `[ssSortableChildren]`.
     *  A typical use is with an @ngrx/store: `getList: _listId => this.store.select(...)` */
    getList?(listId: any): Observable<Iterable<Data>>;

    /** Optional; some implementations do not need beginDrag. */
    beginDrag?(item: DraggedItem<Data>, monitor: DragSourceMonitor<void, void>): void;

    /** Required.
     *
     * After `hover`, the element you picked up (= *transit*) must be:
     *
     * 1. under the mouse; and
     * 2. at the index `item.hover.index` in the list identified by
     *    `item.hover.listId`
     */
    hover(item: DraggedItem<Data>, monitor: DropTargetMonitor<DraggedItem<Data>>): void;

    /** Required; because if you don't have a drop function, what are you even doing? */
    drop(item: DraggedItem<Data>, monitor: DropTargetMonitor<DraggedItem<Data>>): void;

    /** Required; you must reset and remove any temporarily added data from the drag. */
    endDrag(item: DraggedItem<Data>, monitor: DragSourceMonitor<DraggedItem<Data>>): void;

    /** Optional; you may override the default 'same trackBy' implementation.
     *
     * isDragging determines which card on the ground will regard itself as
     * "the same as the one in flight". It must return true for exactly one
     * card at a time, and that card MUST be placed under the most recently
     * hovered DraggedItem.
     *
     * If it is not implemented correctly, then each card will not be able to
     * determine whether it is under the mouse (and therefore should not emit
     * hover events); you will get a deluge of incorrect hover events.
     *
     * By default, it is defined as:

```typescript
trackBy(ground) === trackBy(inFlight.data)
```

     * If you want to be able to copy cards around, and there's an extra clone
     * in transit around the board, you have to be careful to implement
     * isDragging correctly, or ensure that any clones have a different
     * `trackBy()` result. Note, however, that the item in `beginDrag` is the
     * original, so simply giving clones a different `id` is not typically
     * enough; the clone will not respond to `isDragging`, the original will
     * (and you want to move the clone).
     *
     * Therefore, one solution is as follows:
     *
```typescript
isDragging: (ground, inFlight) => {
    let flyingId = this.isCopying ? CARD_ID_WHEN_COPYING : inFlight.data.id;
    return ground.id === flyingId;
}
```
     *
     */
    isDragging?(ground: Data, inFlight: DraggedItem<Data>): boolean;

    /** Optional; you may override default `() => true`.
     *
     *  When used with the `[ssExternal]` directive, the first two arguments will be undefined,
     *  because the data has not yet been created and external items are not associated with a list.
     *  You should be able to decide `canDrag` without these.
     */
    canDrag?(data: Data, listId: any, monitor: DragSourceMonitor<void, void>): boolean;

    /** Optional; you may override default `() => true`.
     *  Inspect `item.hover` for where it is hovering. */
    canDrop?(item: DraggedItem<Data>, monitor: DropTargetMonitor<DraggedItem<Data>>): boolean;

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


export enum HoverTrigger {
    halfway = "halfway",
    fixed = "fixed",
}

export interface RenderContext<Data> {
    data: Data;
    index: number;
    horizontal: boolean;
    hoverTrigger: HoverTrigger;
    listId: number;
    spec: SortableSpec<Data>;
}
