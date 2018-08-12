import { DraggedItem } from "./dragged-item";
import { Data } from "./data";

export interface SortableSpec<T extends Data = Data> {
    removeOnSpill?: boolean,
    revertOnSpill?: boolean,
    trackBy: (data: T) => any;
    canDrag?: (data: T, listId: any) => boolean;
    canDrop?: (item: DraggedItem<T>) => boolean;
    copy?: (item: DraggedItem<T>) => T | boolean;
    clone?: (data: T) => T;
    beginDrag?: (item: DraggedItem<T>) => void;
    hover?: (item: DraggedItem<T>) => void;
    drop?: (item: DraggedItem<T>) => void;
    endDrag?: (item: DraggedItem<T>) => void;
}
