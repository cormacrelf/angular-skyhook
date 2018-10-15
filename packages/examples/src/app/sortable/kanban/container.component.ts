import { Component, ElementRef } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";
import { spillTarget } from "@angular-skyhook/sortable";
import { ItemTypes } from './item-types';
import { Store } from '@ngrx/store';
import { Spill } from './store';
import { Card } from './card';

@Component({
    selector: 'kanban-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss'],
})
export class ContainerComponent {

    // this emits a 'hover' only once when you move over the spill area
    // and again if you move over another drop target and come back.
    // note: uses isOver({shallow:true}), so you can stack other targets on top
    // and they won't be considered 'spilled'
    cardSpill = spillTarget<Card>(this.dnd, ItemTypes.CARD, {
        // see implementation details in store.ts
        hover: item => this.store.dispatch(new Spill(item)),
        // can also add a drop method, useful for 'remove on spill' functionality
        // drop: item => this.store.dispatch(new RemoveCard(item))
    });

    constructor(
        private dnd: SkyhookDndService,
        private el: ElementRef,
        private store: Store<{}>
    ) { }

    ngAfterViewInit() {
        // spill = anywhere in this container component
        // could easily be document.body
        this.cardSpill.connectDropTarget(this.el.nativeElement);
    }
    ngOnDestroy() {
        // it's a regular drop target! don't forget to unsubscribe.
        this.cardSpill.unsubscribe();
    }
}
