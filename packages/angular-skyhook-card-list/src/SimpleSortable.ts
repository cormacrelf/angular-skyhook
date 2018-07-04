import { Data } from './data';
import { DraggedItem } from './dragged-item';
import { SortableSpec } from './SortableSpec';

export class SimpleSortable<T extends Data> implements SortableSpec<T> {
    beforeDrag: T[] = null;

    constructor (public list: T[]) { }

    move(item: DraggedItem<T>) {
        let without = this.beforeDrag.slice(0);
        if (!item.isCopy) {
            without.splice(item.index, 1);
        }
        without.splice(item.hover.index, 0, item.data);
        this.list = without;
    }

    beginDrag = (item: DraggedItem<T>) => {
        this.beforeDrag = this.list;
    }
    hover = (item: DraggedItem<T>) => {
        this.move(item);
    }
    drop = (item: DraggedItem<T>) => {
        this.move(item);
    }
    endDrag = (item: DraggedItem<T>) => {
        this.list = this.beforeDrag;
        this.beforeDrag = null;
    }
}


