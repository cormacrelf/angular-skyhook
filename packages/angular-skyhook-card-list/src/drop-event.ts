export interface DropEvent {
    id: number;
    from: {
        listId: any;
        index: number;
    };
    to: {
        listId: any;
        index: number;
    };
}
