import { Data } from './data';
import { DraggedItem } from './dragged-item';
import { SortableSpec } from './SortableSpec';
import { BehaviorSubject } from 'rxjs';

export class SimpleSortable<T extends Data> implements SortableSpec<T> {
    private beforeDrag: T[] | null = null;
    private emitter$: BehaviorSubject<T[]|undefined>;

    get either() {
        return this.beforeDrag || this.list;
    }

    constructor (
        public list: T[],
        public listId: any,
        public trackBy: (item: T) => any,
        public onChange?: (newValue: T[]) => void,
        public onCommit?: (newValue: T[]) => void
    ) {
        this.emitter$ = new BehaviorSubject(list);
    }

    tryUpdateList(list: T[]) {
        // if there is a drag in progress, don't set the list.
        if (this.beforeDrag === null) {
            this.list = list;
        }
    }

    getList(_listId: any) {
        return this.emitter$;
    }

    move(item: DraggedItem<T>) {
        let without = this.either.slice(0);
        if (!item.isCopy && item.listId === this.listId) {
            without.splice(item.index, 1);
        }
        without.splice(item.hover.index, 0, item.data);
        this.list = without;
    }

    beginDrag = () => {
        this.beforeDrag = this.list;
    }
    hover = (item: DraggedItem<T>) => {
        if (this.beforeDrag === null) {
            this.beforeDrag = this.list;
        }
        this.move(item);
        if (this.onChange) {
            this.onChange(this.list);
        }
    }
    drop = (item: DraggedItem<T>) => {
        if (this.beforeDrag === null) {
            this.beforeDrag = this.list;
        }
        this.move(item);
        if (this.onCommit) {
            this.onCommit(this.list);
        }
    }
    endDrag = () => {
        this.list = this.either;
        this.beforeDrag = null;
        if (this.onChange) {
            this.onChange(this.list);
        }
    }
}
