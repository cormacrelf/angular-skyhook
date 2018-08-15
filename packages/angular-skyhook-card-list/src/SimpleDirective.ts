import { Directive, Input, Host, Self, EventEmitter, Output, OnChanges, SimpleChanges } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { Data } from "./data";
import { SimpleSortable } from "./SimpleSortable";
import { Subscription } from 'rxjs';


@Directive({
    selector: '[simple]'
})
export class SimpleSortableDirective<T extends Data> {
    private listValue: T[] | undefined;
    @Output() simpleChange = new EventEmitter<T[]>();
    @Input() set simple(list: T[] | undefined) {
        this.listValue = list;
        if (list) {
            // this.host.updateChildren(list);
            if (this._sortable) {
                this._sortable.tryUpdateList(list);
            }
        }
    }
    get simple() {
        return this.listValue;
    }
    private _sortable?: SimpleSortable<T>;

    constructor(@Host() @Self() private host: CardListComponent) {}

    ngOnInit() {
        if (this.simple) {
            this._sortable = new SimpleSortable(this.simple, this.host.listId,
                (_x) => 0, // todo: trackBy
                (neu) => {
                    this.simple = neu;
                }, (neu) => {
                    this.simple = neu;
                    this.simpleChange.emit(neu);
                }
            );
            this.host.cardListSpec = this._sortable;
        }
    }
    ngOnChanges() {
        if (this._sortable) {
            this._sortable.listId = this.host.listId;
        }
    }
}

import { SharedSortableService } from "./SharedSortableService";

@Directive({
    selector: '[shared]'
})
export class DragulaDirective<T extends Data> implements OnChanges {
    @Output() sharedChange = new EventEmitter<T[]>();
    @Input() shared!: T[];

    subs = new Subscription();

    constructor(
        @Host() @Self() private host: CardListComponent,
        private service: SharedSortableService<T>
    ) {}

    ngOnInit() {
        // this.host.updateChildren(this.shared);
        this.service.tryUpdateList(this.host.type, this.host.listId, this.shared);
        this.subs.add(this.service.specFor(this.host.type).subscribe(spec => {
            this.host.cardListSpec = spec;
        }));
        this.subs.add(this.host.children$.subscribe(list => {
            list && list !== this.shared && this.sharedChange.emit(list as any as T[]);
        }));
    }

    ngOnChanges({ shared }: SimpleChanges) {
        if (shared) {
            // this.host.updateChildren(this.shared);
            this.service.tryUpdateList(this.host.type, this.host.listId, this.shared);
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
