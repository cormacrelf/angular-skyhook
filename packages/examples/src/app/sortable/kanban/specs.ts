import { Injectable } from "@angular/core";
import { NgRxSortable } from "@angular-skyhook/sortable";
import { KanbanList } from './lists';
import { Card } from "./card";
import { ItemTypes } from "./item-types";
import { Store, select } from '@ngrx/store';
import { ActionTypes, _render, _listById, _isCopying, CARD_ID_WHEN_COPYING } from "./store";
import { filter } from 'rxjs/operators';


@Injectable()
export class SortableSpecService {

    // These specs will pull data from our store with the provided getList
    // functions. Then they will fire actions on this.store with the type
    // provided, which we handle above.
    //                                      (fire on this, with this action type)
    //                                       vvvvvvvvvv    vvvvvvvvvvvvvvvvvvvv
    boardSpec = new NgRxSortable<KanbanList>(this.store,   ActionTypes.SortList, {
        type: ItemTypes.LIST,
        trackBy: list => list.id,
        getList: _listId => this.store.pipe(select(_render)),
    });

    isCopying = false;

    subs = this.store.pipe(select(_isCopying))
        .subscribe(x => this.isCopying = x);

    listSpec = new NgRxSortable<Card>(this.store, ActionTypes.SortCard, {
        type: ItemTypes.CARD,
        trackBy: card => card.id,
        // here we use the different listId on each kanban-list to pull different data
        getList: listId => this.store.pipe(select(_listById(listId)), filter(x => x != undefined)),

        // isDragging determines which card on the ground will regard itself as
        // "the same as the one in flight". It must return true for exactly one
        // card at a time, and that card MUST be placed under the most recently
        // hovered DraggedItem.
        //
        // By default, it is defined as
        //
        //     trackBy(ground) === trackBy(inFlight.data).
        //
        // But we want to be able to copy cards around -- so when there's an
        // extra clone in transit around the board, we have to be careful to
        // implement isDragging correctly.

        // In this case:
        //
        // 1. We set id = a unique CARD_ID_WHEN_COPYING on any clones (if they
        //    kept the same ID, there would be ngFor anomalies due to trackBy).
        //    See store.ts.
        //
        // 2. We don't get to modify the inFlight data, so instead, we compare
        //    ground.id to CARD_ID_WHEN_COPYING when we're copying.
        //
        // You can see for yourself that there is never more than one card with
        // CARD_ID_WHEN_COPYING, so:
        //
        // a. trackBy still returns a different value for every card on the
        //    board;
        // b. exactly one card will return true from isDragging.
        // c. that card will be the clone if copying, otherwise the original.
        // d. as long as the clone follows the hover around like the original
        //    normally does, it stays in place.

        isDragging: (ground, inFlight) => {
            let flyingId = this.isCopying ? CARD_ID_WHEN_COPYING : inFlight.data.id;
            return ground.id === flyingId;
        }
    });

    constructor(public store: Store<{}>) { }

    // usually services don't get destroyed, but if it is, we will be ON IT.
    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
