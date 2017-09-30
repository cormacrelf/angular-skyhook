import { getEmptyImage } from 'react-dnd-html5-backend';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { snapToGrid } from './snapToGrid';
import { DndService } from '../../angular-dnd'

interface Offset { x: number, y: number };

@Component({
  selector: 'app-custom-drag-layer',
  template: `
  <ng-container *ngIf="(collect$|async).isDragging">
  <div *ngIf="collect$|async as c" [ngStyle]="getItemStyles(c)">
  <ng-container [ngSwitch]="(c.itemType)">

    <ng-container *ngSwitchCase="'BOX'">
      <app-box-drag-preview [title]="c.item.title"></app-box-drag-preview>
    </ng-container>

    <ng-container *ngSwitchCase="'TRASH'">
      picked up a box
    </ng-container>

  </ng-container>
  </div>
  </ng-container>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      pointer-events: none;
      z-index: 100;
      left: 0;
      top: 0;
      width: 100%; height: 100%;
    }
    `]
})
export class CustomDragLayerComponent implements OnInit, OnDestroy {

  dragLayer = this.dnd.dragLayer();

  collect$ = this.dragLayer.collect(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  // item$ = this.dragLayer.collect(m => m.getItem());
  // itemType$ = this.dragLayer.collect(m => m.getItemType());
  // offset$ = this.dragLayer.collect(m => ({
  //   initialOffset: m.getInitialSourceClientOffset() as Offset,
  //   currentOffset: m.getSourceClientOffset() as Offset,
  // })).subscribe(a => console.log(a.initialOffset, a.currentOffset));
  // isDragging$ = this.dragLayer.collect(m => m.isDragging());
  //
  constructor(private dnd: DndService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.dragLayer.destroy();
  }

  getItemStyles(props) {
    const { initialOffset, currentOffset } = props;
    if (!initialOffset || !currentOffset) {
      return {
        display: 'none',
      };
    }

    let { x, y } = currentOffset;

    if (props.snapToGrid) {
      x -= initialOffset.x;
      y -= initialOffset.y;
      [x, y] = snapToGrid(x, y);
      x += initialOffset.x;
      y += initialOffset.y;
    }

    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  }

}
