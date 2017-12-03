import { Component, OnInit, Input, NgZone, Output, ElementRef, EventEmitter, ContentChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { DndService } from 'angular-hovercraft';

import { Directive } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
interface Card { id: number; text: string; };

@Directive({
  selector: '[cardInner]'
})
export class CardInnerDirective {}

@Component({
  selector: 'app-card',
  template: `
  <div [dropTarget]="cardTarget" [dragSource]="cardSource" class="card" [style.opacity]="opacity$|async">
    <ng-container *ngTemplateOutlet="cardInnerTemplate; context: {$implicit: card}"></ng-container>
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
  changeDetection: ChangeDetectionStrategy.OnPush
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

  cardSource = this.dnd.dragSource({
    type: "CARD",
    beginDrag: () => {
      this.beginDrag.emit();
      return {
        id: this.id,
        index: this.index,
      };
    },
    endDrag: (monitor) => {
      const { id: droppedId, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();

      // this.moveCard(droppedId, originalIndex);
      this.endDrag.emit(didDrop);
    }
  }, this.destroy);

  cardTarget = this.dnd.dropTarget({
    types: "CARD",
    hover: (monitor) => {
      const dragIndex = monitor.getItem().index;
      const hoverIndex = this.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
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
      this.moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the collect item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    },
  }, this.destroy);

  opacity$ = this.cardSource.collect(monitor => monitor.isDragging() ? 0.2 : 1);

  constructor(private zone: NgZone, private elRef: ElementRef, private dnd: DndService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy.unsubscribe();
  }

}
