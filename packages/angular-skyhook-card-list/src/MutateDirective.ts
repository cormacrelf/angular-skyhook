import { Directive, Input, Host, Self, ChangeDetectorRef, EventEmitter, Output } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { Data } from "./data";
import { DraggedItem } from "./dragged-item";
import { SortableSpec } from './SortableSpec';

@Directive({
    selector: '[mutate]'
})
export class MutateDirective<T extends Data> implements SortableSpec<T> {
    _mutable: Array<T>;

    @Output() mutateChange = new EventEmitter<T[]>();

    @Input('mutate') set mutable(neu: Array<T>) {
        this._mutable = neu;
        this.host.updateChildren(neu);
        this.mutateChange.emit(neu);
    }
    get mutable() {
        return this._mutable;
    }

    _override: T[] = null;

    set override(x: T[]) {
        this._override = x;
        if (x) {
            this.host.updateChildren(x);
        }
    }
    get override() {
        return this._override;
    }

    constructor(@Host() @Self() private host: CardListComponent) {}

    ngOnInit() {
        this.host.spec = this;
    }

    move(item: DraggedItem<T>, mutate: boolean) {
        let without = mutate ? this.mutable : this.mutable.slice(0);
        if (!item.isCopy /* && item.listId = this.listId */) {
            without.splice(item.index, 1);
        }
        without.splice(item.hover.index, 0, item.data);
        if (mutate) {
            this.mutable = without;
        } else {
            this.override = without;
        }
    }

    beginDrag = (item: DraggedItem<T>) => {
        // start using a throwaway clone
        this.override = this.mutable;
    }
    hover = (item: DraggedItem<T>) => {
        // don't mutate the clone, just override again
        this.move(item, false);
        console.log(this.override);
    }
    drop = (item: DraggedItem<T>) => {
        // mutate the original, and stop overriding
        this.override = null;
        this.move(item, true);
    }
    endDrag = (item: DraggedItem<T>) => {
        this.override = null;
    }
}
