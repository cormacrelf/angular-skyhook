import { Data } from "./data";
import { Size } from "./size";

export interface DraggedItem<D extends Data = Data> {
    data: D;
    size: Size;
    id: number;
    index: number;
    listId: any;
    isCopy: boolean;
    hover: {
        index: number;
        listId: number;
    }
}
