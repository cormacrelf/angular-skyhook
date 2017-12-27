import { Component, OnInit } from '@angular/core';
import { DndService } from 'angular-hovercraft';

@Component({
  selector: 'app-drag-container',
  template: `
  <div [ngStyle]="styles" [dropTarget]="boxTarget">
    <app-draggable-box [left]="x" [top]="y" id="23" title="this box is titled"></app-draggable-box>
  </div>
  `,
  styles: []
})
export class DragContainerComponent implements OnInit {

  x = 30;
  y = 90;

  styles = {
    width: '400px',
    height: '400px',
    boxSizing: 'border-box',
    border: '1px solid black',
    position: 'relative',
  };

  boxTarget = this.dnd.dropTarget({
    types: ['BOX'],
    drop: (monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const item = monitor.getItem();
      console.log(item, delta);
      const dropped = monitor.getDropResult();
      this.moveBox(item.id, item.left + delta.x, item.top + delta.y);
    }
  });

  constructor(private dnd: DndService) { }

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
