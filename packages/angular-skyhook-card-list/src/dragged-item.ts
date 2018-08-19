import { Data } from "./data";
import { Size } from "./size";

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
