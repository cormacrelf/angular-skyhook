import { Data } from './data';
import { DraggedItem } from './dragged-item';
import { SortableSpec } from './SortableSpec';

export class SimpleSortable<T extends Data> implements SortableSpec<T> {
    beforeDrag: T[] | null = null;

    constructor (public list: T[]) { }

    either() {
        return this.beforeDrag || this.list;
    }

    move(item: DraggedItem<T>) {
        let without = this.either().slice(0);
        if (!item.isCopy) {
            without.splice(item.index, 1);
        }
        without.splice(item.hover.index, 0, item.data);
        this.list = without;
    }

    beginDrag = (_item: DraggedItem<T>) => {
        this.beforeDrag = this.list;
    }
    hover = (item: DraggedItem<T>) => {
        this.move(item);
    }
    drop = (item: DraggedItem<T>) => {
        this.move(item);
    }
    endDrag = (_item: DraggedItem<T>) => {
        this.list = this.either();
        this.beforeDrag = null;
    }
}


