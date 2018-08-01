import { Data } from "./data";
import { Size } from "./size";

export interface DraggedItem<D = Data> {
    data: D;
    size: Size;
    index: number;
    type: string | symbol;
    listId: any;
    isInternal?: boolean;
    isCopy: boolean;
    hover: {
        index: number;
        listId: any;
    }
}
