import { DraggedItem, SortableSpec } from "angular-skyhook-card-list";
import { KanbanList, Lists } from "./lists";
import { Card } from "app/kanban/card";
import { BehaviorSubject, Observable } from "rxjs";
import { scan, startWith, publishReplay, refCount, map, distinctUntilChanged } from "rxjs/operators";
import { insertList, removeList, insertCard, removeCard } from './lists';
import { createSelector } from "@ngrx/store";

const select = <I, O>(project: (item: I) => O) => (input: Observable<I>): Observable<O> => {
    return input.pipe(
        map(project),
        distinctUntilChanged()
    )
}

export enum ActionTypes {
    BeginDragList = "[Sortable] BeginDragList",
    HoverList     = "[Sortable] HoverList",
    DropList      = "[Sortable] DropList",
    EndDragList   = "[Sortable] EndDragList",
    BeginDragCard = "[Sortable] BeginDragCard",
    HoverCard     = "[Sortable] HoverCard",
    DropCard      = "[Sortable] DropCard",
    EndDragCard   = "[Sortable] EndDragCard",
}

export class BeginDragList {
    readonly type = ActionTypes.BeginDragList;
    constructor(public item: DraggedItem<KanbanList>) {}
}
export class HoverList {
    readonly type = ActionTypes.HoverList;
    constructor(public item: DraggedItem<KanbanList>) {}
}
export class DropList {
    readonly type = ActionTypes.DropList;
    constructor(public item: DraggedItem<KanbanList>) {}
}
export class EndDragList {
    readonly type = ActionTypes.EndDragList;
    constructor(public item: DraggedItem<KanbanList>) {}
}

export class BeginDragCard {
    readonly type = ActionTypes.BeginDragCard;
    constructor(public item: DraggedItem<Card>) {}
}
export class HoverCard {
    readonly type = ActionTypes.HoverCard;
    constructor(public item: DraggedItem<Card>) {}
}
export class DropCard {
    readonly type = ActionTypes.DropCard;
    constructor(public item: DraggedItem<Card>) {}
}
export class EndDragCard {
    readonly type = ActionTypes.EndDragCard;
    constructor(public item: DraggedItem<Card>) {}
}

type Actions
    = BeginDragList
    | HoverList
    | DropList
    | EndDragList
    | BeginDragCard
    | HoverCard
    | DropCard
    | EndDragCard;

export interface Shape {
    listData: ReadonlyArray<KanbanList>;
    dragListData: ReadonlyArray<KanbanList>;
    card: DraggedItem<Card>;
    list: DraggedItem<KanbanList>;
}

export class BoardService {

    private actions$ = new BehaviorSubject<Actions>({
        type: "@@init"
    } as any as Actions);

    private initialState: Shape;
    public store$: Observable<Shape>;
    lists$: Observable<ReadonlyArray<KanbanList>>;

    constructor(data: ArrayLike<KanbanList>) {
        this.initialState = {
            listData: Lists,
            dragListData: null as ReadonlyArray<KanbanList>,
            card: null,
            list: null,
        };
        this.store$ = this.actions$.pipe(
            scan(BoardService.reducer, this.initialState),
            startWith(this.initialState),
            publishReplay(),
            refCount()
        );
        this.lists$ = this.store$.pipe(select(_render));
    }

    static reducer(state: Shape, action: Actions): Shape {
        const currentList = state.dragListData || state.listData;

        switch (action.type) {
            case ActionTypes.BeginDragList: {
                const { data, index } = action.item;
                return {
                    ...state,
                    list: action.item,
                    dragListData: removeList(currentList, index)
                };
            }

            case ActionTypes.HoverList: {
                return { ...state, list: action.item };
            }

            case ActionTypes.DropList: {
                const { data, hover } = action.item;
                return {
                    ...state,
                    listData: insertList(currentList, data, hover.index),
                    dragListData: null,
                    list: null
                };
            }

            case ActionTypes.EndDragList: {
                return { ...state, dragListData: null, list: null };
            }

            case ActionTypes.BeginDragCard: {
                const { index, listId } = action.item;
                return {
                    ...state,
                    dragListData: removeCard(currentList, listId, index),
                    card: action.item
                };
            }

            case ActionTypes.HoverCard: {
                return { ...state, card: action.item };
            }

            case ActionTypes.DropCard: {
                const { data, hover } = action.item;
                return {
                    ...state,
                    listData: insertCard(currentList, data, hover.listId, hover.index),
                    dragListData: null,
                    card: null
                };
            }

            case ActionTypes.EndDragCard: {
                return { ...state, dragListData: null, card: null };
            }

            default:
                return state;
        }
    }

    listsSpec: SortableSpec<KanbanList> = {
        trackBy: (list: KanbanList) => list.id,
        beginDrag: item => this.dispatch(new BeginDragList(item)),
        hover: item => this.dispatch(new HoverList(item)),
        drop: item => this.dispatch(new DropList(item)),
        endDrag: item => this.dispatch(new EndDragList(item)),
    }

    cardsSpec: SortableSpec<Card> = {
        trackBy: (card: Card) => card.id,
        beginDrag: item => this.dispatch(new BeginDragCard(item)),
        hover: item => this.dispatch(new HoverCard(item)),
        drop: item => this.dispatch(new DropCard(item)),
        endDrag: item => this.dispatch(new EndDragCard(item)),
    }

    dispatch(a: Actions) {
        this.actions$.next(a);
    }

}

const _dragListData = createSelector(
    (state: Shape) => state,
    state => state.dragListData || state.listData
);
const _dragCard = createSelector(
    (state: Shape) => state,
    state => state.card
);
const _dragList = createSelector(
    (state: Shape) => state,
    state => state.list
);
const _render = createSelector(
    _dragListData,
    _dragCard,
    _dragList,
    (data, card, list) => {
        if (card != null) {
            const { index, listId } = card.hover;
            data = insertCard(data, card.data, listId, index);
        }
        if (list != null) {
            const { index, listId } = list.hover;
            data = insertList(data, list.data, index);
        }
        return data;
    }
)
