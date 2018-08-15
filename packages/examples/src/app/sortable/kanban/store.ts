import { DraggedItem, SortableSpec } from "angular-skyhook-card-list";
import { KanbanList, Lists } from "./lists";
import { Card } from "./card";
import { BehaviorSubject, Observable } from "rxjs";
import { scan, startWith, publishReplay, refCount, map, distinctUntilChanged } from "rxjs/operators";
import { insertList, removeList, insertCard, removeCard } from './lists';
import { createSelector, ActionReducerMap, Store, select, createFeatureSelector } from "@ngrx/store";
import { Injectable } from "@angular/core";

export enum ActionTypes {
    BeginDragList = "[Sortable] BeginDragList",
    HoverList     = "[Sortable] HoverList",
    DropList      = "[Sortable] DropList",
    EndDragList   = "[Sortable] EndDragList",
    BeginDragCard = "[Sortable] BeginDragCard",
    HoverCard     = "[Sortable] HoverCard",
    DropCard      = "[Sortable] DropCard",
    EndDragCard   = "[Sortable] EndDragCard",
    // non-sortable operations
    AddCard       = "[Sortable] AddCard",
    RemoveCard    = "[Sortable] RemoveCard",
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

export class AddCard {
    readonly type = ActionTypes.AddCard;
    constructor(public listId: number, public title: string) {}
}
export class RemoveCard {
    readonly type = ActionTypes.RemoveCard;
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
    | EndDragCard
    | AddCard
    | RemoveCard
;

export interface BoardState {
    listData: ReadonlyArray<KanbanList>;
    dragListData: ReadonlyArray<KanbanList>;
    card: DraggedItem<Card>;
    list: DraggedItem<KanbanList>;
    nextId: number;
}

export const initialBoard = {
    listData: Lists,
    dragListData: null as ReadonlyArray<KanbanList>,
    card: null,
    list: null,
    nextId: 1000,
};

export function reducer(state: BoardState = initialBoard, action: Actions): BoardState {
    const currentBoard = state.dragListData || state.listData;

    switch (action.type) {
        case ActionTypes.BeginDragList: {
            const { data, index } = action.item;
            return {
                ...state,
                list: action.item,
                dragListData: removeList(currentBoard, index)
            };
        }

        case ActionTypes.HoverList: {
            return { ...state, list: action.item };
        }

        case ActionTypes.DropList: {
            const { data, hover } = action.item;
            return {
                ...state,
                listData: insertList(currentBoard, data, hover.index),
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
                dragListData: removeCard(currentBoard, listId, index),
                card: action.item
            };
        }

        case ActionTypes.HoverCard: {
            return { ...state, card: action.item };
        }

        case ActionTypes.DropCard: {
            const { data, hover } = action.item;
            const listData = insertCard(currentBoard, data, hover.listId, hover.index);
            return {
                ...state,
                listData,
                dragListData: null,
                card: null
            };
        }

        case ActionTypes.EndDragCard: {
            return { ...state, dragListData: null, card: null };
        }

        case ActionTypes.AddCard: {
            const card: Card = { id: state.nextId, title: action.title };
            const list = currentBoard.find(x => x.id === action.listId);
            const index = list.cards.length;
            return {
                ...state,
                listData: insertCard(state.listData, card, action.listId, index),
                dragListData: null,
                nextId: state.nextId + 1,
            };
        }

        case ActionTypes.RemoveCard: {
            const { listId, index } = action.item;
            return {
                ...state,
                listData: removeCard(state.listData, listId, index),
                dragListData: null,
                nextId: state.nextId + 1,
            };
        }

        default:
            return state;
    }
}

@Injectable()
export class BoardService {

    board$ = this.store.pipe(select(_boardFeature));
    lists$ = this.board$.pipe(select(_render));

    constructor(public store: Store<State>) { }

    boardSpec: SortableSpec<KanbanList> = {
        trackBy: (list: KanbanList) => list.id,
        getList: listId => this.lists$,
        beginDrag: item => this.store.dispatch(new BeginDragList(item)),
        hover: item => this.store.dispatch(new HoverList(item)),
        drop: item => this.store.dispatch(new DropList(item)),
        endDrag: item => this.store.dispatch(new EndDragList(item)),
    }

    listSpec: SortableSpec<Card> = {
        trackBy: (card: Card) => card.id,
        getList: listId => this.lists$.pipe(map(ls => ls.find(l => l.id === listId)), map(l => l && l.cards)),
        beginDrag: item => this.store.dispatch(new BeginDragCard(item)),
        hover: item => this.store.dispatch(new HoverCard(item)),
        drop: item => this.store.dispatch(new DropCard(item)),
        endDrag: item => this.store.dispatch(new EndDragCard(item)),
    }

}

const _boardFeature = createFeatureSelector<BoardState>('kanban');
const _dragListData = createSelector(
    (state: BoardState) => state,
    state => state.dragListData || state.listData
);
const _dragCard = createSelector(
    (state: BoardState) => state,
    state => state.card
);
const _dragList = createSelector(
    (state: BoardState) => state,
    state => state.list
);
const _render = createSelector(
    _dragListData,
    _dragCard,
    _dragList,
    (board, dragCard, dragList) => {
        if (dragCard != null) {
            const { index, listId } = dragCard.hover;
            board = insertCard(board, dragCard.data, listId, index);
        }
        if (dragList != null) {
            const { index, listId } = dragList.hover;
            board = insertList(board, dragList.data, index);
        }
        return board;
    }
);

export interface State {
    board: BoardState;
}

export const reducers: ActionReducerMap<State> = {
  board: reducer,
};
