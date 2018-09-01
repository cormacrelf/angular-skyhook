import { Component } from '@angular/core';
import { SkyhookDndService, DragSourceSpec } from 'angular-skyhook';
import { SortableSpec, DraggedItem, Size } from 'angular-skyhook-card-list';
import { Card } from './card';
import { ItemTypes } from './item-types';
import { SortableSpecService } from './specs';

@Component({
    selector: 'kanban-external',
    template: `
    <div class="ext">
        <kanban-card
            [sortableExternal]="externalSpec"
            #ext="sortableExternal"
            [card]="card"
            [dragSource]="ext.source"
            [noHTML5Preview]="true">
        </kanban-card>
    </div>
    `,
    styles: [`
        .ext { margin-right: 8px; margin-bottom: 8px; display: inline-block; }
    `]
})
export class KanbanExternalComponent {
    ItemTypes = ItemTypes;

    // create some dummy data to pass to kanban-card
    card: Card = {
        id: 1337,
        title: 'External card - drag me in!'
    };

    nextId = 3000000;

    externalSpec: SortableSpec<Card> = {
        ...this.specs.listSpec,
        beginDrag: () => {
            // do nothing
            // we don't want to remove any cards from the store, because this external card isn't in it yet
        },
        createData: () => {
            return {
                id: this.nextId++,
                title: this.card.title
            }
        }
    }

    constructor(
        private specs: SortableSpecService,
    ) {}

}
