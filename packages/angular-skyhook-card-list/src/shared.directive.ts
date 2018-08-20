import { Directive, Input, Host, Self, EventEmitter, Output, OnChanges, SimpleChanges } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { Data } from "./types";
import { Subscription } from 'rxjs';

import { SharedSortableService } from "./SharedSortableService";

@Directive({
    selector: '[shared]'
})
export class SharedDirective<T extends Data> implements OnChanges {
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
