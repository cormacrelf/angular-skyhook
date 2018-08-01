import { DraggedItem } from "./dragged-item";
import { Size } from "./size";

export interface HoverEvent {
    mouse: number;
    hover: {
        listId: any;
        index: number;
        size: Size;
        start: number;
    };
    source: DraggedItem;
}

export interface BeginEvent {
    id: number;
    index: number;
    size: Size;
}
