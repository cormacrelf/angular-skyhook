import { Component, OnInit, Input, NgZone, Output, ElementRef, EventEmitter, ContentChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { SkyhookDndService } from 'angular-skyhook';

import { Directive } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Card } from './sorted.component';

@Directive({
  selector: '[cardInner]'
})
export class CardInnerDirective {}

@Component({
  selector: 'app-card',
  template: `
  <div [dropTarget]="cardTarget" [dragSource]="cardSource">
    <div class="card" [style.opacity]="opacity$|async">
      <ng-container *ngTemplateOutlet="cardInnerTemplate; context: {$implicit: card}"></ng-container>
    </div>
  </div>
  `,
  styles: [`
    .card {
      border: 1px dashed gray;
      padding: 0.5rem 1rem;
      margin-bottom: .5rem;
      background-color: white;
      cursor: move;
    }
    `],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardComponent implements OnInit {

  @Output() beginDrag: EventEmitter<void> = new EventEmitter<void>();
  @Output() endDrag: EventEmitter<boolean> = new EventEmitter();
  @Output() onMove: EventEmitter<[number, number]> = new EventEmitter();

  @ContentChild(CardInnerDirective, {read: TemplateRef}) cardInnerTemplate;

  @Input() card: Card;

  @Input() index: number;
  @Input() id: number;
  @Input() text: string;

  destroy = new Subscription();

  moveCard(a, b) {
    this.onMove.emit([a, b]);
  }

  cardSource = this.dnd.dragSource("CARD", {
    beginDrag: () => {
      this.beginDrag.emit();
      return {
        id: this.id,
        index: this.index,
        lane: this.card.lane
      };
    },
    isDragging: m => m.getItem().id === this.card.id,
    endDrag: (monitor) => {
      const { id: droppedId, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();

      // this.moveCard(droppedId, originalIndex);
      this.endDrag.emit(didDrop);
    }
  }, this.destroy);

  cardTarget = this.dnd.dropTarget("CARD", {
    hover: (monitor) => {
      const dragIndex = monitor.getItem().index;
      const lane1 = monitor.getItem().lane;
      const lane2 = this.card.lane;
      const hoverIndex = this.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && lane1 === lane2) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = this.elRef.nativeElement.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // console.log("moving card")

      // Time to actually perform the action
      this.onMove.emit([lane1, dragIndex, lane2, hoverIndex]);

      // Note: we're mutating the item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
      monitor.getItem().lane = lane2;
    },
  }, this.destroy);

  opacity$ = this.cardSource.listen(monitor => monitor.isDragging() ? 0.5 : 1);

  constructor(private zone: NgZone, private elRef: ElementRef, private dnd: SkyhookDndService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy.unsubscribe();
  }

}
