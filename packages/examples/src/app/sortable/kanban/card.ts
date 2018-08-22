export interface Card {
    id: number;
    title: string;
    isCopy?: boolean;
}

export type Cards = ReadonlyArray<Card>;
