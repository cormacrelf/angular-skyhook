import { DraggedItem } from "./dragged-item";
import { Data } from "./data";
import { SortableSpec } from './SortableSpec';

export class ParentChildSortable<P extends Data & { children: C[] }, C extends Data> {
    beforeDrag: P[] | null = null;
    constructor (
        public parents: P[],
        public options: {
            parent?: {
                copy?: (item: DraggedItem<P>) => P,
                canDrop?: (item: DraggedItem<P>) => boolean,
            },
            child?: {
                copy?: (item: DraggedItem<C>) => C,
                canDrop?: (item: DraggedItem<C>) => boolean,
            }
        } = { }
    ) {
    }

    either() {
        return this.beforeDrag || this.parents;
    }

    moveParent(item: DraggedItem<P>) {
        let without = this.either().slice(0);
        if (!item.isCopy) {
            without.splice(item.index, 1);
        }
        without.splice(item.hover.index, 0, item.data);
        this.parents = without;
    }

    moveChild(item: DraggedItem<C>) {
        const fromListIdx = this.either().findIndex(p => p.id === item.listId)
        const toListIdx = this.either().findIndex(p => p.id === item.hover.listId)
        let neu = this.either().slice(0);

        if (!item.isCopy) {
            let fromChildren = neu[fromListIdx].children.slice(0);
            fromChildren.splice(item.index, 1);
            const fromList: P = Object.assign({}, neu[fromListIdx], {
                children: fromChildren
            });
            neu[fromListIdx] = fromList;
        }

        let toChildren = neu[toListIdx].children.slice(0);
        toChildren.splice(item.hover.index, 0, item.data);
        const toList: P = Object.assign({}, neu[toListIdx], {
            children: toChildren
        });
        neu[toListIdx] = toList;

        this.parents = neu;
    }

    parentSpec: SortableSpec<P> = {
        copy: this.options.parent && this.options.parent.copy,
        canDrop: this.options.parent && this.options.parent.canDrop,
        beginDrag: () => {
            this.beforeDrag = this.parents;
        },
        hover: (item) => {
            this.moveParent(item);
        },
        drop: (item) => {
            this.moveParent(item);
            this.beforeDrag = null;
        },
        endDrag: () => {
            this.parents = this.either();
            this.beforeDrag = null;
        }
    };

    childSpec: SortableSpec<C> = {
        copy: this.options.child && this.options.child.copy,
        canDrop: this.options.child && this.options.child.canDrop,
        beginDrag: () => {
            this.beforeDrag = this.parents;
        },
        hover: (item) => {
            this.moveChild(item);
        },
        drop: (item) => {
            this.moveChild(item);
            this.beforeDrag = null;
        },
        endDrag: () => {
            this.parents = this.either();
            this.beforeDrag = null;
        }
    }
}

