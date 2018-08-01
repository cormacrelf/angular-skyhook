import { Component, ChangeDetectionStrategy } from "@angular/core";
import { SimpleSortable } from "angular-skyhook-card-list";
import * as faker from 'faker';

@Component({
    selector: 'app-simple-sortable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <skyhook-card-list type="SIMPLE" [(simple)]="list">
        <!-- [(simple)]="list" [children]="list"> -->

        <ng-template cardTemplate let-context>
            <div [cardRenderer]="context"
                 #render="cardRenderer"
                 [class.dragging]="render.isDragging$|async"
                 [dragSource]="render.source">

                <pre>{{ render.data.title | json }}</pre>

            </div>
        </ng-template>

    </skyhook-card-list>
    `,
    styles: [`
        div { max-width: 300px; margin: 4px; border: 1px dashed #333; }
        pre { margin: 0; }
        .dragging pre { opacity: 0.4; background: #eee; }
    `]
})
export class SimpleComponent {
    list = [
        { id: 1, title: faker.name.firstName() },
        { id: 2, title: faker.name.firstName() },
        { id: 3, title: faker.name.firstName() },
        { id: 4, title: faker.name.firstName() },
        { id: 5, title: faker.name.firstName() },
    ];
}
