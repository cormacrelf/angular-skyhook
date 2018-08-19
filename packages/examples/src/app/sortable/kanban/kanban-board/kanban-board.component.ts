import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { DraggedItem } from "angular-skyhook-card-list";
import { Card } from "../card";
import { ItemTypes } from "../item-types";
import { BoardService, AddCard, RemoveCard } from "../store";

@Component({
    selector: "kanban-board",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./kanban-board.component.html",
    styleUrls: ["./kanban-board.component.scss"]
})
export class KanbanBoardComponent {
    ItemTypes = ItemTypes;
    nextId = 16;

    // The specs are responsible for providing a data source.
    // Here, they pull data from the @ngrx Store.
    boardSpec = this.boardService.boardSpec;
    listSpec = this.boardService.listSpec;

    constructor(private boardService: BoardService) {}

    addCard(listId: number, title: string) {
        this.boardService.store.dispatch(new AddCard(listId, title));
    }

    removeCard(ev: DraggedItem<Card>) {
        this.boardService.store.dispatch(new RemoveCard(ev));
    }

}
