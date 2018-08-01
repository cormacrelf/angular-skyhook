import { Directive, Input, Host, Self, ChangeDetectorRef, EventEmitter, Output, SimpleChange } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { Data } from "./data";
import { DraggedItem } from "./dragged-item";
import { SortableSpec } from './SortableSpec';
import { SimpleSortable } from "./SimpleSortable";


@Directive({
    selector: '[simple]'
})
export class SimpleSortableDirective<T extends Data> {
    listValue: T[];
    @Output() simpleChange = new EventEmitter<T[]>();
    @Input() set simple(list: T[]) {
        this.listValue = list;
        this.host.updateChildren(list);
        if (this._sortable) {
            this._sortable.tryUpdateList(list);
        }
    }
    get simple() {
        return this.listValue;
    }
    _sortable: SimpleSortable<T>;

    constructor(@Host() @Self() private host: CardListComponent) {}

    ngOnInit() {
        this._sortable = new SimpleSortable(this.simple, this.host.listId, (neu) => {
            this.simple = neu;
        }, (neu) => {
            this.simple = neu;
            this.simpleChange.emit(neu);
        });
        this.host.spec = this._sortable;
    }
    ngOnChanges(changes: { list?: SimpleChange }) {
        if (this._sortable) {
            this._sortable.listId = this.host.listId;
        }
    }
}
