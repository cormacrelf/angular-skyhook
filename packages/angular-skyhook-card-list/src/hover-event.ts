import { Data } from './data';
import { DraggedItem } from './dragged-item';
import { Size } from './size';

export interface HoverEvent {
    mouse: number;
    hover: {
        listId: any;
        index: number;
        size: Size;
        start: number;
        x: number;
        y: number;
    };
    source: DraggedItem;
}

export interface BeginEvent {
    id: number;
    index: number;
    size: Size;
}
