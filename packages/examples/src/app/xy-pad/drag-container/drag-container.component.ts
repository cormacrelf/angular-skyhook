import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SkyhookDndService, Offset } from "@angular-skyhook/core";
import { snapToGrid } from '../custom-drag-layer/snapToGrid';
import { Spot } from '../spot';

@Component({
    selector: 'xy-drag-container',
    template: `
  <div class="glow"></div>
  <div class="scanline"></div>

  <div [dropTarget]="boxTarget" class="square">
    <div *ngFor="let i of gridlines" class="gridline horizontal" [style.top.px]="px * i - 1"></div>
    <div *ngFor="let i of gridlines" class="gridline vertical" [style.left.px]="px * i - 1"></div>
    <xy-draggable-box [spot]="spot" (endDrag)="dragEnded($event)"></xy-draggable-box>
  </div>

  <xy-custom-drag-layer
      [snapToGrid]="snapToGrid" [incrementPx]="px"
      (moved)="emitEach($event)"
      ></xy-custom-drag-layer>
  `,
    styleUrls: ['./drag-container.component.scss']
})
export class DragContainerComponent {
    @Input() x = 50;
    @Input() y = 100;

    get spot(): Spot {
        return {
            id: 23,
            x: this.x,
            y: this.y
        };
    }

    @Output() endDrag = new EventEmitter<void>();
    @Output() moved = new EventEmitter<Offset>();

    @Input() snapToGrid = false;
    px = 32;
    snappingFunction = snapToGrid(this.px);
    gridlines: Array<any>;
    @Input()
    set incrementPx(n: number) {
        this.px = n;
        this.snappingFunction = snapToGrid(n);
        this.setGridlines();
    }

    boxTarget = this.dnd.dropTarget('BOX', {});

    constructor(private dnd: SkyhookDndService) {
        this.incrementPx = 25;
    }

    emitEach(loc: Offset) {
        this.moved.emit(loc);
    }

    dragEnded(spot: Spot) {
        this.endDrag.emit();
    }

    ngOnDestroy() {
        this.boxTarget.unsubscribe();
    }

    setGridlines() {
        this.gridlines = new Array(Math.floor(400 / this.px) - 1)
            .fill(0)
            .map((_, i) => i + 1);
    }
}
