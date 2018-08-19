import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { DraggedItem, NgRxSortable } from "angular-skyhook-card-list";
import { KanbanList } from '../lists';
import { Card } from "../card";
import { ItemTypes } from "../item-types";
import { ActionTypes, AddCard, RemoveCard, _render, _listById } from "../store";
import { Store, select } from '@ngrx/store';

@Component({
    selector: "kanban-board",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./kanban-board.component.html",
    styleUrls: ["./kanban-board.component.scss"]
})
export class KanbanBoardComponent {
    ItemTypes = ItemTypes;

    // These specs will pull data from our store with the provided getList
    // functions. Then they will fire actions on this.store with the type
    // provided, which we handle above.
    //                                      (fire on this, with this action type)
    //                                       vvvvvvvvvv    vvvvvvvvvvvvvvvvvvvv
    boardSpec = new NgRxSortable<KanbanList>(this.store,   ActionTypes.SortList, {
        trackBy: list => list.id,
        getList: _listId => this.store.pipe(select(_render)),
    });

    listSpec = new NgRxSortable<Card>(this.store, ActionTypes.SortCard, {
        trackBy: card => card.id,
        // here we use the different listId on each kanban-list to pull different data
        getList: listId => this.store.pipe(select(_listById(listId))),
    });

    constructor(public store: Store<{}>) { }

    addCard(listId: number, title: string) {
        this.store.dispatch(new AddCard(listId, title));
    }

    removeCard(ev: DraggedItem<Card>) {
        this.store.dispatch(new RemoveCard(ev));
    }

}
