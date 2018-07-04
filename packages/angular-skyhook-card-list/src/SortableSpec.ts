import { DraggedItem } from "./dragged-item";
import { Data } from "./data";

export interface SortableSpec<T extends Data = Data> {
    canDrop?: (item: DraggedItem<T>) => boolean;
    copy?: (item: DraggedItem<T>) => T | void | null;
    beginDrag?: (item: DraggedItem<T>) => void;
    hover?: (item: DraggedItem<T>) => void;
    drop?: (item: DraggedItem<T>) => void;
    endDrag?: (item: DraggedItem<T>) => void;
}
