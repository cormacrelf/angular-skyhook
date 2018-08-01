import { Component, ChangeDetectionStrategy } from "@angular/core";
import { SimpleSortable } from "angular-skyhook-card-list";
import * as faker from 'faker';

@Component({
    selector: 'app-simple-sortable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-template #card cardTemplate let-context>
        <div [cardRenderer]="context"
             #render="cardRenderer"
             [class.dragging]="render.isDragging$|async"
             [dragSource]="render.source">

            <div class="card">
                <pre>{{ render.data.name | json }}</pre>
            </div>

        </div>
    </ng-template>

    <div class="flex">
        <skyhook-card-list class="list" type="SIMPLE" listId="me" [(shared)]="list" [template]="card"></skyhook-card-list>
        <skyhook-card-list class="list list--right" type="SIMPLE" listId="you" [(shared)]="list2" [template]="card"></skyhook-card-list>
    </div>
    <div class="flex">
        <pre>{{list|json}}</pre>
        <pre>{{list2|json}}</pre>
    </div>
    `,
    styles: [`
        .flex { display: flex; }
        .flex > * { flex-grow: 1; flex-shrink: 0; min-width: 0; }
        .card { min-width: 0; width: 100%; max-width: 300px; margin: 4px; border: 1px dashed #333; }
        pre { margin: 0; }
        .dragging pre { opacity: 0.4; background: #eee; }
        .list--right pre { color: #a70000; }
        .list--right pre { background: rgba(255, 0, 0, 0.1); }
    `]
})
export class SimpleComponent {
    list = [
        { id: 1, name: faker.name.firstName() },
        { id: 2, name: faker.name.firstName() },
        { id: 3, name: faker.name.firstName() },
        { id: 4, name: faker.name.firstName() },
        { id: 5, name: faker.name.firstName() },
    ];
    list2 = [
        { id: 11, name: faker.name.firstName() },
        { id: 12, name: faker.name.firstName() },
        { id: 13, name: faker.name.firstName() },
    ];
}
