import { SortableSpec, DraggedItem } from './types';
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

export interface ConfigureSpec<D> {
    type: string|symbol;
    trackBy: (data: D) => any;
    getList: (listId: any) => Observable<Iterable<D>>;
    canDrag?: (data: D, listId: any) => boolean;
    canDrop?: (item: DraggedItem<D>) => boolean;
    isDragging?: (ground: D, inFlight: DraggedItem<D>) => boolean;
    // copy?: (item: DraggedItem<T>) => boolean | T;
    // clone?: (data: T) => T;
}

export class NgRxSortable<D> implements SortableSpec<D> {
    public type!: string|symbol;
    public trackBy!: (data: D) => any;
    public getList!: (listId: any) => Observable<Iterable<D>>;
    public canDrag?: (data: D, listId: any) => boolean;
    public canDrop?: (item: DraggedItem<D>) => boolean;
    public isDragging?: (ground: D, inFlight: DraggedItem<D>) => boolean;

    /**
     * @param store      An @ngrx store instance.
     * @param actionType The type in your own @ngrx/store `ActionTypes` enum you want the sortable actions to use.
     * @param configure  You must provide `trackBy` and `getList` functions here. Hopefully your `getList` will select from the store you passed!
     * */
    constructor(
        protected store: Dispatcher,
        protected actionType: string,
        configure: ConfigureSpec<D>,
    ) {
        if (configure.type) this.type = configure.type;
        if (configure.trackBy) this.trackBy = configure.trackBy;
        if (configure.getList) this.getList = configure.getList;
        if (configure.canDrag) this.canDrag = configure.canDrag;
        if (configure.canDrop) this.canDrop = configure.canDrop;
        if (configure.isDragging) this.isDragging = configure.isDragging;
    }

    // We now implement the SortableSpec interface by dispatching actions

    beginDrag = (item: DraggedItem<D>) => {
        this.store.dispatch(new BeginDragAction(this.actionType, item));
    }
    hover = (item: DraggedItem<D>) => {
        this.store.dispatch(new HoverAction(this.actionType, item));
    }
    drop = (item: DraggedItem<D>) => {
        this.store.dispatch(new DropAction(this.actionType, item));
    }
    endDrag = (item: DraggedItem<D>) => {
        this.store.dispatch(new EndDragAction(this.actionType, item));
    }
}
