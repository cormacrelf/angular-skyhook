import * as faker from "faker";
import { Card } from "./card";

export interface KanbanList {
    id: number;
    title: string;
    children: Array<Card>;
}

export const Lists: ReadonlyArray<KanbanList> = [
    {
        id: 0,
        title: "To Do",
        children: [
            { id: 1, title: faker.lorem.sentence() },
            { id: 2, title: faker.lorem.sentence() },
            { id: 3, title: faker.lorem.sentence() },
            { id: 4, title: faker.lorem.sentence() },
            {
                id: 5,
                title:
                    "cannot be presumed that you would ever run away, Mrs Stevens, not that I would ever care, but the best food is always made by accident"
            }
        ]
    },
    {
        id: 1,
        title: "Doing",
        children: [
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
        children: [
            { id: 11, title: faker.name.jobTitle() },
            { id: 12, title: faker.name.jobTitle() },
            { id: 13, title: faker.name.jobTitle() },
            { id: 14, title: faker.name.jobTitle() },
            { id: 15, title: faker.name.jobTitle() }
        ]
    }
];

import { default as update } from 'immutability-helper';

export function insertList(lists: ReadonlyArray<KanbanList>, list: KanbanList, index: number) {
    // return lists.slice(0).splice(index, 0, list);
    return update(lists, {
        $splice: [[index, 0, list]]
    })
}
export function removeList(lists: ReadonlyArray<KanbanList>, index: number) {
    // return lists.slice(0).splice(index, 1);
    return update(lists, {
        $splice: [[index, 1]]
    })
}

export function removeCard(lists: ReadonlyArray<KanbanList>, listId: number, index: number) {
    const fromListIdx = lists.findIndex(b => b.id === listId);
    // const list = {
    //     ...lists[fromListIdx],
    //     cards: lists[fromListIdx].cards.slice(0).splice(index, 1);
    // }
    // return lists.slice(0).splice(fromListIdx, 1, list) ;
    return update(lists, {
        [fromListIdx]: { cards: { $splice: [[index, 1]] } }
    });
}

export function insertCard(lists: ReadonlyArray<KanbanList>, card: Card, listId: number, index: number) {
    const fromListIdx = lists.findIndex(b => b.id === listId);
    // const list = {
    //     ...lists[fromListIdx],
    //     cards: lists[fromListIdx].cards.slice(0).splice(index, 1);
    // }
    // return lists.slice(0).splice(fromListIdx, 1, list) ;
    return update(lists, {
        [fromListIdx]: { cards: { $splice: [[index, 0, card]] } }
    });
}
