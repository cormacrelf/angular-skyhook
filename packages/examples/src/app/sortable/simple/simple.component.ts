import { Component, ChangeDetectionStrategy } from "@angular/core";
import * as faker from 'faker';
import { SortableSpec, DraggedItem } from "angular-skyhook-card-list";
import { BehaviorSubject, combineLatest } from "rxjs";

interface SimpleData {
    id: number;
    name: string;
}

@Component({
    selector: 'app-simple-sortable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <skyhook-card-list class="list"
        cardListType="SIMPLE"
        cardListId="simple-demo"
        [cardListSpec]="simpleSpec">
        <ng-template cardTemplate let-context>
            <div class="card"
                [cardRenderer]="context"
                #render="cardRenderer"
                [class.placeholder]="render.isDragging$|async"
                [dragSource]="render.source">
                <pre>{{ render.data.name | json }}</pre>
            </div>
        </ng-template>
    </skyhook-card-list>
    `,
    styles: [`
        .flex { display: flex; }
        .flex > * { flex-grow: 1; flex-shrink: 0; min-width: 0; }
        .card { min-width: 0; width: 100%; max-width: 300px; margin: 4px; border: 1px dashed #333; }
        .card { cursor: move; }
        pre { margin: 0; }
        .placeholder pre { opacity: 0.4; background: #eee; }
        .list--right pre { color: #a70000; }
        .list--right pre { background: rgba(255, 0, 0, 0.1); }
    `]
})
export class SimpleComponent {

    list: SimpleData[] = [
        { id: 1, name: faker.name.firstName() },
        { id: 2, name: faker.name.firstName() },
        { id: 3, name: faker.name.firstName() },
        { id: 4, name: faker.name.firstName() },
        { id: 5, name: faker.name.firstName() },
    ];

    list$ = new BehaviorSubject(this.list);

    move(item: DraggedItem<SimpleData>) {
        const temp = this.list.slice(0);
        temp.splice(item.index, 1);
        temp.splice(item.hover.index, 0, item.data);
        this.list$.next(temp);
        return temp;
    }

    simpleSpec: SortableSpec<SimpleData> = {
        trackBy: x => x.id,
        getList: _ => this.list$,
        hover: (item) => {
            this.move(item);
        },
        drop: (item) => {
            this.list = this.move(item);
        },
        endDrag: item => {
            this.list$.next(this.list);
        }
    }

}
