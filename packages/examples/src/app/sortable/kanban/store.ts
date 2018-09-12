import { createSelector, createFeatureSelector } from "@ngrx/store";

import { DraggedItem, SortableAction, SortableEvents } from "@angular-skyhook/sortable";

// our list operations
import { KanbanList, KanbanBoard, initialBoard, insertList, removeList, insertCard, removeCard } from './lists';
import { Card } from "./card";

export enum ActionTypes {
    SortList   = "[Kanban] SortList",
    SortCard   = "[Kanban] SortCard",
    AddCard    = "[Kanban] AddCard",
    RemoveCard = "[Kanban] RemoveCard",
    Spill      = "[Kanban] Spill",
}

// Define an action for each of the sortables your reducer will be handling
// An NgRxSortable (see kanban-board.component.ts) will produce actions like these.
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
export class Spill {
    readonly type = ActionTypes.Spill;
    constructor(public item: DraggedItem<Card>) {}
}

// Include all the above actions
type Actions = SortList | SortCard | AddCard | RemoveCard | Spill;

export interface BoardState {
    /** This is the clean state, a list of KanbanList objects. */
    board: KanbanBoard,
    /** Holds a modified version of `board` that DOESN'T contain whatever item is in-flight,
     * or null if no item has currently been picked up from a sortable. */
    draggingBoard: KanbanBoard | null;
    // Hold in-flight items in state so we can inject them back into draggingBoard, in a selector
    cardInFlight: DraggedItem<Card> | null;
    listInFlight: DraggedItem<KanbanList> | null;
    nextId: number;
    spilledCard: boolean;
    isCopying: boolean;
    shouldCopy: boolean;
}

export const initialState = {
    board: initialBoard,
    draggingBoard: null,
    cardInFlight: null,
    listInFlight: null,
    nextId: 1000,
    spilledCard: false,
    isCopying: false,
    shouldCopy: false,
};

const resetDrag = (state: BoardState): BoardState => ({
    ...state,
    draggingBoard: null,
    cardInFlight: null,
    listInFlight: null,
    isCopying: false,
    spilledCard: false
});

export const CARD_ID_WHEN_COPYING = Symbol("CLONED_CARD") as any;
const cloneCard = (card: Card, nextId: any) => ({ ...card, id: nextId });

// -  When you're not copying, draggingBoard holds 'board - cardInFlight.data',
//    so you can just insertCard wherever it is meant to go.
// -  When you ARE copying, you don't care: you want 'board + clone of
//    cardInFlight.data'
// -  So this function returns whichever one depending on isCopying, and neatly
//    increments nextId for you (so it gives you a whole state back).
const copyOrInsertCard = (state: BoardState, clonedCard: Card): BoardState => {
    let { board, nextId } = state;
    if (state.cardInFlight) {
        const { data, hover } = state.cardInFlight;
        if (state.isCopying) {
            nextId++;
            board = state.spilledCard
                    ? state.board
                    : insertCard(state.board, clonedCard, hover.listId, hover.index);
        } else {
            const either = state.draggingBoard || state.board;
            board = state.spilledCard
                ? either
                : insertCard(either, data, hover.listId, hover.index);
        }
    }
    return { ...resetDrag(state), board, nextId };
}

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
                ...resetDrag(state),
                board: insertList(currentBoard, data, hover.index),
            };
        }
        case SortableEvents.EndDrag: {
            return resetDrag(state);
        }
        default: return state;
    }
}

export function cardReducer(state: BoardState, action: SortCard) {
    const { data, index, listId, hover } = action.item;

    // turn off 'spill' any time a reordering happens, because that means card has left spill area
    state = { ...state, spilledCard: false };
    switch (action.event) {
        case SortableEvents.BeginDrag: {
            return {
                ...state,
                draggingBoard: removeCard(state.board, listId, index),
                cardInFlight: action.item,
                isCopying: state.shouldCopy && listId === 1,
            };
        }
        case SortableEvents.Hover: {
            return { ...state, cardInFlight: action.item };
        }
        case SortableEvents.Drop: {
            return copyOrInsertCard(state, cloneCard(state.cardInFlight.data, state.nextId));
        }
        case SortableEvents.EndDrag: {
            return resetDrag(state);
        }
        default: return state;
    }
}

// In your 'main' reducer, catch the action types you defined above and hand them off to the mini-reducers.
// This helps keep your main reducer small, compared to nesting switch statements.

export function reducer(state: BoardState = initialState, action: Actions): BoardState {
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
                ...resetDrag(state),
                board: insertCard(state.board, card, action.listId, index),
                nextId: state.nextId + 1,
            };
        }

        case ActionTypes.RemoveCard: {
            const { listId, index } = action.item;
            return {
                ...resetDrag(state),
                board: removeCard(state.board, listId, index),
            };
        }

        case ActionTypes.Spill: {
            return { ...state, spilledCard: true, cardInFlight: action.item }
        }

        default:
            return state;
    }
}

const _boardState   = createFeatureSelector<BoardState>('kanban');

export const _isCopying    = createSelector(_boardState, s => s.isCopying);
export const _cardInFlight = createSelector(_boardState, state => state.cardInFlight);
// produce a clone to be inserted into the board while dragging
// a permanent one is created on drop
export const _temporaryClone   = createSelector(
    _isCopying,
    _cardInFlight,
    (copying, card) => (copying && card) ? cloneCard(card.data, CARD_ID_WHEN_COPYING) : null);

const _board = createSelector(_boardState, state => state.board);
export const _listById = (listId: any) => createSelector(_board, board => {
    const list = board.find(l => l.id === listId);
    return list && list.cards;
});

// This is the final piece of the puzzle. In the reducers above, we simply
// removed a card or list in BeginDrag, and added it back in Drop or EndDrag.
// Here, we insert the removed item back into the list -- wherever it is
// currently hovering (`item.hover`). The advantage of doing it this way is
// twofold:
// 1. The removeXXX operation is cached
// 2. Supports dragging cards from external sources with no extra effort.
//    Consider: external sources won't call BeginDrag, so removeXXX will not be
//    called. Then insertXXX is called here -- and it works.

export const _render = createSelector(
    _boardState,
    _temporaryClone,
    (state, tempClone) => {
        const { cardInFlight, listInFlight } = state;
        let either = state.draggingBoard || state.board;

        if (cardInFlight != null) {
            return copyOrInsertCard(state, tempClone).board;
        }
        if (listInFlight != null) {
            const { hover, data } = listInFlight;
            return insertList(either, data, hover.index);
        }
        return either;
    }
);
