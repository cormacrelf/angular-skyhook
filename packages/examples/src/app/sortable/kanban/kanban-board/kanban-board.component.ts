import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { DraggedItem } from "@angular-skyhook/sortable";
import { Card } from "../card";
import { ItemTypes } from "../item-types";
import { AddCard, RemoveCard } from "../store";
import { Store } from '@ngrx/store';
import { SortableSpecService } from '../specs';

@Component({
    selector: "kanban-board",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./kanban-board.component.html",
    styleUrls: ["./kanban-board.component.scss"]
})
export class KanbanBoardComponent {
    ItemTypes = ItemTypes;

    constructor(
        private store: Store<{}>,
        public specs: SortableSpecService
    ) { }

    addCard(listId: number, title: string) {
        this.store.dispatch(new AddCard(listId, title));
    }

    removeCard(ev: DraggedItem<Card>) {
        this.store.dispatch(new RemoveCard(ev));
    }

}
