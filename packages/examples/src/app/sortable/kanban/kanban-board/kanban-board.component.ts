import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { DropEvent, DraggedItem, HoverEvent, SortableSpec } from "angular-skyhook-card-list";
import { Lists, KanbanList, removeList, insertList, removeCard, insertCard } from "../lists";
import { default as update } from "immutability-helper";
import { Card } from "../card";
import { ItemTypes } from "../item-types";
import { BehaviorSubject, Observable } from "rxjs";
import { map, distinctUntilChanged, scan, startWith, publishReplay, refCount } from "rxjs/operators";
import { createSelector, Action } from "@ngrx/store";
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
