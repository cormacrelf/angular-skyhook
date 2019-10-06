import { SortableSpec, DraggedItem } from './types';
import { DropTargetMonitor, DragSourceMonitor } from '@angular-skyhook/core';
import { Observable } from 'rxjs';

export enum SortableEvents {
    BeginDrag = "BeginDrag",
    Hover     = "Hover",
    Drop      = "Drop",
    EndDrag   = "EndDrag",
}

export class BeginDragAction<AT, T> {
    readonly event = SortableEvents.BeginDrag;
    constructor(public readonly type: AT, public readonly item: DraggedItem<T>) {}
}

export class HoverAction<AT, T> {
    readonly event = SortableEvents.Hover;
    constructor(public readonly type: AT, public readonly item: DraggedItem<T>) {}
}

export class DropAction<AT, T> {
    readonly event = SortableEvents.Drop;
    constructor(public readonly type: AT, public readonly item: DraggedItem<T>) {}
}

export class EndDragAction<AT, T> {
    readonly event = SortableEvents.EndDrag;
    constructor(public readonly type: AT, public readonly item: DraggedItem<T>) {}
}

export type SortableAction<AT, D> =
    | BeginDragAction<AT, D>
    | HoverAction<AT, D>
    | DropAction<AT, D>
    | EndDragAction<AT, D>;

/** Intended to be your NgRx Store object */
export interface Dispatcher {
    dispatch: (action: SortableAction<any, any>) => void;
}

export interface NgRxSortableConfiguration<D> {
    type: string|symbol;
    accepts?: string|symbol|(string | symbol)[];
    trackBy: (data: D) => any;
    getList: (listId: any) => Observable<Iterable<D>>;
    canDrop?: (item: DraggedItem<D>, monitor: DropTargetMonitor<DraggedItem<D>>) => boolean;
    canDrag?: (data: D, listId: any, monitor: DragSourceMonitor<void, void>) => boolean;
    isDragging?: (ground: D, inFlight: DraggedItem<D>) => boolean;
    createData?: () => D;
}

export class NgRxSortable<D> implements SortableSpec<D> {
    public type!: string|symbol;
    public accepts?: string|symbol|(string|symbol)[];
    public trackBy!: (data: D) => any;
    public getList!: (listId: any) => Observable<Iterable<D>>;
    public canDrop?: (item: DraggedItem<D>, monitor: DropTargetMonitor<DraggedItem<D>>) => boolean;
    public canDrag?: (data: D, listId: any, monitor: DragSourceMonitor<void, void>) => boolean;
    public isDragging?: (ground: D, inFlight: DraggedItem<D>) => boolean;
    public createData?: () => D;

    /**
     * @param store      An @ngrx store instance.
     * @param actionType The type in your own @ngrx/store `ActionTypes` enum you want the sortable actions to use.
     * @param configure  You must provide `trackBy` and `getList` functions here. Hopefully your `getList` will select from the store you passed!
     * */
    constructor(
        protected store: Dispatcher,
        protected actionType: string,
        configure: NgRxSortableConfiguration<D>,
    ) {
        if (configure.type !== undefined) this.type = configure.type;
        if (configure.accepts !== undefined) this.accepts = configure.accepts;
        if (configure.trackBy !== undefined) this.trackBy = configure.trackBy;
        if (configure.getList !== undefined) this.getList = configure.getList;
        if (configure.canDrag !== undefined) this.canDrag = configure.canDrag;
        if (configure.canDrop !== undefined) this.canDrop = configure.canDrop;
        if (configure.isDragging !== undefined) this.isDragging = configure.isDragging;
        if (configure.createData !== undefined) this.createData = configure.createData;
    }

    // We now implement the SortableSpec interface by dispatching actions

    beginDrag = (item: DraggedItem<D>, _monitor: DragSourceMonitor<void, void>): void => {
        this.store.dispatch(new BeginDragAction(this.actionType, item));
    }
    hover = (item: DraggedItem<D>, _monitor: DropTargetMonitor<DraggedItem<D>>): void => {
        this.store.dispatch(new HoverAction(this.actionType, item));
    }
    drop = (item: DraggedItem<D>, _monitor: DropTargetMonitor<DraggedItem<D>>): void => {
        this.store.dispatch(new DropAction(this.actionType, item));
    }
    endDrag = (item: DraggedItem<D>, _monitor: DragSourceMonitor<DraggedItem<D>>): void => {
        this.store.dispatch(new EndDragAction(this.actionType, item));
    }
}
