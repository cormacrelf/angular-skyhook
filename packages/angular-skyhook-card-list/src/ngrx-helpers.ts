import { DraggedItem } from './dragged-item';
import { SortableSpec } from './SortableSpec';
import { Observable } from 'rxjs';

export enum SortableEvents {
    BeginDrag = "BeginDrag",
    Hover     = "Hover",
    Drop      = "Drop",
    EndDrag   = "EndDrag",
}

export class BeginDrag<ActionType, T> {
    readonly event = SortableEvents.BeginDrag;
    constructor(public readonly type: ActionType, public readonly item: DraggedItem<T>) {}
}

export class Hover<ActionType, T> {
    readonly event = SortableEvents.Hover;
    constructor(public readonly type: ActionType, public readonly item: DraggedItem<T>) {}
}

export class Drop<ActionType, T> {
    readonly event = SortableEvents.Drop;
    constructor(public readonly type: ActionType, public readonly item: DraggedItem<T>) {}
}

export class EndDrag<ActionType, T> {
    readonly event = SortableEvents.EndDrag;
    constructor(public readonly type: ActionType, public readonly item: DraggedItem<T>) {}
}

export type SortableAction<ActionType, D> = BeginDrag<ActionType, D> | Hover<ActionType, D> | Drop<ActionType, D> | EndDrag<ActionType, D>;

/** Intended to be your NgRx Store object */
export interface Dispatcher {
    dispatch: (action: SortableAction<any, any>) => void;
}

export interface ConfigureSpec<D> {
    trackBy: (data: D) => any;
    getList: (listId: any) => Observable<Iterable<D>>;
    canDrag?: (data: D, listId: any) => boolean;
    canDrop?: (item: DraggedItem<D>) => boolean;
    // copy?: (item: DraggedItem<T>) => boolean | T;
    // clone?: (data: T) => T;
}

export class NgRxSortable<D> implements SortableSpec<D> {
    public trackBy!: (data: D) => any;
    public getList!: (listId: any) => Observable<Iterable<D>>;
    public canDrag?: (data: D, listId: any) => boolean;
    public canDrop?: (item: DraggedItem<D>) => boolean;

    /**
     * @param store      An @ngrx store instance.
     * @param actionType The type in your own @ngrx/store `ActionTypes` enum you want the sortable actions to use.
     * @param configure  You must provide `trackBy` and `getList` functions here. Hopefully your `getList` will select from the store you passed!
     * */
    constructor(private store: Dispatcher, public actionType: string, configure: ConfigureSpec<D>) {
        this.trackBy = configure.trackBy;
        this.getList = configure.getList;
        this.canDrag = configure.canDrag;
        this.canDrop = configure.canDrop;
    }

    // We now implement the SortableSpec interface by dispatching actions

    beginDrag = (item: DraggedItem<D>) => {
        this.store.dispatch(new BeginDrag(this.actionType, item));
    }
    hover = (item: DraggedItem<D>) => {
        this.store.dispatch(new Hover(this.actionType, item));
    }
    drop = (item: DraggedItem<D>) => {
        this.store.dispatch(new Drop(this.actionType, item));
    }
    endDrag = (item: DraggedItem<D>) => {
        this.store.dispatch(new EndDrag(this.actionType, item));
    }
}
