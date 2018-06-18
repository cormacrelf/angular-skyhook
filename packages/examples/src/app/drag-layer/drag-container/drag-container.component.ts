import { Component, OnInit, OnDestroy } from '@angular/core';
import { SkyhookDndService } from 'angular-skyhook';
import { DraggedItem } from '../dragged-item';

@Component({
  selector: 'app-drag-container',
  template: `
  <div [ngStyle]="styles" [dropTarget]="boxTarget">
    <app-draggable-box [left]="x" [top]="y" id="23" title="this box is titled"></app-draggable-box>
  </div>
  `,
  styles: []
})
export class DragContainerComponent implements OnInit, OnDestroy {

  x = 30;
  y = 90;

  styles = {
    width: '400px',
    height: '400px',
    boxSizing: 'border-box',
    border: '1px solid black',
    position: 'relative',
  };

  boxTarget = this.dnd.dropTarget<DraggedItem>('BOX', {
    drop: (monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const item = monitor.getItem();
      this.moveBox(item.id, item.left + delta.x, item.top + delta.y);
    }
  });

  constructor(private dnd: SkyhookDndService) { }

  moveBox(id: any, x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.boxTarget.unsubscribe();
  }

}
