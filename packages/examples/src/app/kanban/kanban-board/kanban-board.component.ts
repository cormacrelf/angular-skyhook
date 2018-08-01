import { Component, Input } from "@angular/core";
import { DropEvent, DraggedItem, HoverEvent, SortableSpec, ParentChildSortable } from "angular-skyhook-card-list";
import { Lists, KanbanList, removeList, insertList, removeCard, insertCard } from "../lists";
import { default as update } from "immutability-helper";
import { Card } from "../card";
import { ItemTypes } from "../item-types";
import { BehaviorSubject, Observable } from "rxjs";
import { map, distinctUntilChanged, scan, startWith, publishReplay, refCount } from "rxjs/operators";
import { createSelector, Action } from "@ngrx/store";
import { BoardService } from "../store";

@Component({
    selector: "kanban-board",
    templateUrl: "./kanban-board.component.html",
    styleUrls: ["./kanban-board.component.scss"]
})
export class KanbanBoardComponent {
    ItemTypes = ItemTypes;
    nextId = 16;

    parentChild = new ParentChildSortable<KanbanList, Card>(Lists as KanbanList[], {
        // try uncommenting these lines
        // child: {
        //     copy: c => ({ ...c.data, id: this.nextId++ }),
        //     canDrop: i => i.hover.listId === 2
        // }
    });

    ngOnInit() {
    }

    addCard(listId: number, title: string) {
        const listIdx = this.parentChild.parents.findIndex(l => l.id === listId);
        const card: Card = { id: this.nextId++, title };
        this.parentChild.parents = update(this.parentChild.parents, {
            [listIdx]: { children: { $push: [card] } }
        }) as KanbanList[];
    }

    deleteCard(ev: DraggedItem<Card>) {
        const { index, listId } = ev;
        const listIdx = this.parentChild.parents.findIndex(l => l.id === listId);
        this.parentChild.parents = update(this.parentChild.parents, {
            [listIdx]: { children: { $splice: [[index, 1]] } }
        }) as KanbanList[];
    }

    trackById(_, x: { id: any }) {
        return x.id;
    }
}
