import { Component, OnInit, OnDestroy } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";
import { BoxWithLocation } from '../BoxWithLocation';

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
    minHeight: '300px',
    maxWidth: '400px',
    maxHeight: '400px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    border: '1px solid black',
    position: 'relative',
  };

  boxTarget = this.dnd.dropTarget<BoxWithLocation>('BOX', {
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
