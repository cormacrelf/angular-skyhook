import { Directive, Input, Host, Self, EventEmitter, Output, OnChanges, SimpleChanges } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { Subscription } from 'rxjs';

import { SharedSortableService } from "./SharedSortableService";

@Directive({
    selector: '[shared]'
})
export class SharedDirective<Data> implements OnChanges {
    @Output() sharedChange = new EventEmitter<Data[]>();
    @Input() shared!: Data[];

    subs = new Subscription();

    constructor(
        @Host() @Self() private host: CardListComponent<Data>,
        private service: SharedSortableService<Data>
    ) {}

    ngOnInit() {
        // this.host.updateChildren(this.shared);
        this.service.tryUpdateList(this.host.type, this.host.listId, this.shared);
        this.subs.add(this.service.specFor(this.host.type).subscribe(spec => {
            this.host.cardListSpec = spec;
        }));
        this.subs.add(this.host.children$.subscribe(list => {
            list && list !== this.shared && this.sharedChange.emit(list as any as Data[]);
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
