import * as faker from "faker";
import { Card } from "./card";

export interface KanbanList {
    id: number;
    title: string;
    cards: ReadonlyArray<Card>;
}

export const Lists: ReadonlyArray<KanbanList> = [
    {
        id: 0,
        title: "To Do",
        cards: [
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
