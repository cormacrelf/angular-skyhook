import { Data } from "./data";
import { Size } from "./size";

export interface DraggedItem {
    data: Data;
    size: Size;
    id: number;
    index: number;
    listId: any;
}
