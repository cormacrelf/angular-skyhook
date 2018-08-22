import { Observable } from 'rxjs';

export interface SortableSpec<Data, Type = string|symbol> {
    trackBy: (data: Data) => any;
    getList: (listId: any) => Observable<Iterable<Data> | undefined>;
    canDrag?: (data: Data, listId: any) => boolean;
    canDrop?: (item: DraggedItem<Data, Type>) => boolean;
    beginDrag?: (item: DraggedItem<Data, Type>) => void;
    hover?: (item: DraggedItem<Data, Type>) => void;
    drop?: (item: DraggedItem<Data, Type>) => void;
    endDrag?: (item: DraggedItem<Data, Type>) => void;
    // copy?: (item: DraggedItem<Data, Type>) => boolean;
    // clone?: (data: Data) => Data;
}

export class Size {
    constructor(public width: number, public height: number) {}
    style() {
        return {
            width: this.width + "px",
            height: this.height + "px"
        };
    }
}

export interface DraggedItem<Data, DndType = string | symbol> {
    data: Data;
    size: Size;
    type: DndType;
    index: number;
    listId: any;
    isInternal?: boolean;
    // isCopy?: boolean;
    hover: {
        index: number;
        listId: any;
    }
}

export const ItemTypes = {
    CARD: Symbol("CARD"),
    LIST: Symbol("LIST")
};
