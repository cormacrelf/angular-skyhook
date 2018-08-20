import { Observable } from 'rxjs';

export interface SortableSpec<D extends Data = Data, Type = string|symbol> {
    trackBy: (data: D) => any;
    getList: (listId: any) => Observable<Iterable<D> | undefined>;
    canDrag?: (data: D, listId: any) => boolean;
    canDrop?: (item: DraggedItem<D, Type>) => boolean;
    beginDrag?: (item: DraggedItem<D, Type>) => void;
    hover?: (item: DraggedItem<D, Type>) => void;
    drop?: (item: DraggedItem<D, Type>) => void;
    endDrag?: (item: DraggedItem<D, Type>) => void;
    // copy?: (item: DraggedItem<T>) => T | boolean;
    // clone?: (data: T) => T;
}

export interface Data {
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

export interface DraggedItem<D = Data, DndType = string | symbol> {
    data: D;
    size: Size;
    index: number;
    type: DndType;
    listId: any;
    isInternal?: boolean;
    isCopy: boolean;
    hover: {
        index: number;
        listId: any;
    }
}

export const ItemTypes = {
    CARD: Symbol("CARD"),
    LIST: Symbol("LIST")
};
