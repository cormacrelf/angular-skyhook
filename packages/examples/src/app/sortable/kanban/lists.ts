import * as faker from "faker";
import { Card, Cards } from "./card";

export interface KanbanList {
    id: number;
    title: string;
    cards: Cards;
}
export type KanbanBoard = ReadonlyArray<KanbanList>;

// We're using NgRx, so we have to do immutable-only list operations.

// you could use this helper library, but if you're really gunning for @ngrx,
// then you might want Immutable.js instead
// import { default as update } from 'immutability-helper';

// splice is an awkward API that doesn't return the result, it returns an array of deleted elements
// this is better and stops you making that mistake
function withMutations<T>(ts: ReadonlyArray<T>, update: (ts: T[]) => void): ReadonlyArray<T> {
    // shallow clone
    let lists = ts.slice(0) as Array<T>;
    update(lists);
    return lists as ReadonlyArray<T>;
}

function updateCards(board: KanbanBoard, listId: number, f: (cards: Card[]) => void) {
    const fromListIdx = board.findIndex(b => b.id === listId);
    if (fromListIdx === -1) {
        return board;
    }
    const list = {
        ...board[fromListIdx],
        cards: withMutations(board[fromListIdx].cards, f)
    };
    return withMutations(board, ls => {
        ls.splice(fromListIdx, 1, list)
    });
}

export function insertList(board: KanbanBoard, list: KanbanList, index: number) {
    return withMutations(board, ls => {
        ls.splice(index, 0, list);
    });
}

export function removeList(board: KanbanBoard, index: number) {
    return withMutations(board, ls => {
        ls.splice(index, 1);
    });
}

export function removeCard(board: KanbanBoard, listId: number, index: number) {
    return updateCards(board, listId, cards => {
        cards.splice(index, 1);
    });
}

export function insertCard(board: KanbanBoard, card: Card, listId: number, index: number) {
    return updateCards(board, listId, cards => {
        cards.splice(index, 0, card);
    });
}

export const initialBoard: KanbanBoard = [
    {
        id: 0,
        title: "To Do",
        cards: [
            { id: 1, title: faker.lorem.sentence() },
            { id: 2, title: faker.lorem.sentence() },
            { id: 3, title: faker.lorem.sentence() },
            { id: 4, title: faker.lorem.sentence() },
            { id: 5, title: "This card is a bigger than the other ones. "
                + faker.lorem.sentence() + " " + faker.lorem.sentence() }
        ]
    },
    {
        id: 1,
        title: "Doing",
        cards: [
            { id: 6, title: faker.company.bs() },
            { id: 7, title: faker.company.bs() },
            { id: 8, title: faker.company.bs() },
            { id: 9, title: faker.company.bs() },
            { id: 10, title: faker.company.bs() }
        ]
    },
    {
        id: 2,
        title: "Done",
        cards: [
            { id: 11, title: faker.name.jobTitle() },
            { id: 12, title: faker.name.jobTitle() },
            { id: 13, title: faker.name.jobTitle() },
            { id: 14, title: faker.name.jobTitle() },
            { id: 15, title: faker.name.jobTitle() }
        ]
    }
];
