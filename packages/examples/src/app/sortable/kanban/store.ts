import { DraggedItem, SortableSpec, NgRxSortable, SortableAction, SortableEvents } from "angular-skyhook-card-list";
import { KanbanList, Lists } from "./lists";
import { Card } from "./card";
import { BehaviorSubject, Observable } from "rxjs";
import { scan, startWith, publishReplay, refCount, map, distinctUntilChanged } from "rxjs/operators";
import { insertList, removeList, insertCard, removeCard } from './lists';
import { createSelector, ActionReducerMap, Store, select, createFeatureSelector } from "@ngrx/store";
import { Injectable } from "@angular/core";

export enum ActionTypes {
    SortList   = "[Kanban] SortList",
    SortCard   = "[Kanban] SortCard",
    AddCard    = "[Kanban] AddCard",
    RemoveCard = "[Kanban] RemoveCard",
}

// Define an action for each of the sortables your reducer will be handling
// An NgRxSortable (see below) will produce actions like these.
export type SortList = SortableAction<ActionTypes.SortList, KanbanList>;
export type SortCard = SortableAction<ActionTypes.SortCard, Card>;

// Some extra actions to do more things
export class AddCard {
    readonly type = ActionTypes.AddCard;
    constructor(public listId: number, public title: string) {}
}
export class RemoveCard {
    readonly type = ActionTypes.RemoveCard;
    constructor(public item: DraggedItem<Card>) {}
}

// Include all the above actions
type Actions = SortList | SortCard | AddCard | RemoveCard;

export interface BoardState {
    /** This is the clean state, a list of KanbanList objects. */
    board: ReadonlyArray<KanbanList>;
    /** Holds a modified version of `board` that DOESN'T contain whatever item is in-flight,
     * or null if no item has currently been picked up from a sortable. */
    draggingBoard: ReadonlyArray<KanbanList> | null;

    // Hold in-flight items in state so we can inject them back into draggingBoard, in a selector
    cardInFlight: DraggedItem<Card>;
    listInFlight: DraggedItem<KanbanList>;

    nextId: number;
}

export const initialBoard = {
    board: Lists,
    draggingBoard: null as ReadonlyArray<KanbanList>,
    cardInFlight: null,
    listInFlight: null,
    nextId: 1000,
};

// Each of these functions is a 'mini-reducer' dedicated to handling sort events.
// `action.event` is like `action.type`, so use it the same way with a switch statement.

export function listReducer(state: BoardState, action: SortList) {
    const currentBoard = state.draggingBoard || state.board;
    const { data, index, listId, hover } = action.item;
    switch (action.event) {
        case SortableEvents.BeginDrag: {
            return {
                ...state,
                draggingBoard: removeList(state.board, index),
                listInFlight: action.item,
            };
        }
        case SortableEvents.Hover: {
            return { ...state, listInFlight: action.item };
        }
        case SortableEvents.Drop: {
            return {
                ...state,
                board: insertList(currentBoard, data, hover.index),
                draggingBoard: null,
                listInFlight: null
            };
        }
        case SortableEvents.EndDrag: {
            return { ...state, draggingBoard: null, listInFlight: null };
        }
        default: return state;
    }
}

export function cardReducer(state: BoardState, action: SortCard) {
    const currentBoard = state.draggingBoard || state.board;
    const { data, index, listId, hover } = action.item;
    switch (action.event) {
        case SortableEvents.BeginDrag: {
            return {
                ...state,
                draggingBoard: removeCard(state.board, listId, index),
                cardInFlight: action.item
            };
        }
        case SortableEvents.Hover: {
            return { ...state, cardInFlight: action.item };
        }
        case SortableEvents.Drop: {
            return {
                ...state,
                board: insertCard(currentBoard, data, hover.listId, hover.index),
                draggingBoard: null,
                cardInFlight: null
            };
        }
        case SortableEvents.EndDrag: {
            return { ...state, draggingBoard: null, cardInFlight: null };
        }
        default: return state;
    }
}

// In your 'main' reducer, catch the action types you defined above and hand them off to the mini-reducers.
// This helps keep your main reducer small, compared to nesting switch statements.

export function reducer(state: BoardState = initialBoard, action: Actions): BoardState {
    const currentBoard = state.draggingBoard || state.board;

    switch (action.type) {
        case ActionTypes.SortList: {
            return listReducer(state, action);
        }

        case ActionTypes.SortCard: {
            return cardReducer(state, action);
        }

        case ActionTypes.AddCard: {
            const card: Card = { id: state.nextId, title: action.title };
            const list = currentBoard.find(x => x.id === action.listId);
            const index = list.cards.length;
            return {
                ...state,
                board: insertCard(state.board, card, action.listId, index),
                draggingBoard: null,
                nextId: state.nextId + 1,
            };
        }

        case ActionTypes.RemoveCard: {
            const { listId, index } = action.item;
            return {
                ...state,
                board: removeCard(state.board, listId, index),
                draggingBoard: null,
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

    constructor(public store: Store<{}>) { }

    boardSpec = new NgRxSortable<KanbanList>(this.store, ActionTypes.SortList, {
        trackBy: list => list.id,
        getList: listId => this.lists$,
    });

    listSpec = new NgRxSortable<Card>(this.store, ActionTypes.SortCard, {
        trackBy: card => card.id,
        getList: listId => this.lists$.pipe(
            map(ls => ls.find(l => l.id === listId)),
            map(l => l && l.cards)
        ),
    });

}

const _boardFeature = createFeatureSelector<BoardState>('kanban');
const _board = createSelector(
    (state: BoardState) => state,
    state => state.draggingBoard || state.board
);
const _cardInFlight = createSelector((state: BoardState) => state, state => state.cardInFlight);
const _listInFlight = createSelector((state: BoardState) => state, state => state.listInFlight);

// This is the final piece of the puzzle.
// In the reducers above, we simply removed a card or list in BeginDrag, and added it back in Drop or EndDrag.
// Here, we insert the removed item back into the list -- wherever it is currently hovering (`item.hover`).
// The advantage of doing it this way is twofold:
//
// 1. The removeXXX operation is cached
// 2. Supports dragging cards from external sources with no extra effort.
//    Consider: external sources won't call BeginDrag, so removeXXX will not be called.
//    Then insertXXX is called here -- and it works.
const _render = createSelector(
    _board,
    _cardInFlight,
    _listInFlight,
    (board, cardInFlight, listInFlight) => {
        if (cardInFlight != null) {
            const { index, listId } = cardInFlight.hover;
            board = insertCard(board, cardInFlight.data, listId, index);
        }
        if (listInFlight != null) {
            const { index, listId } = listInFlight.hover;
            board = insertList(board, listInFlight.data, index);
        }
        return board;
    }
);
