import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SkyhookDndService, DragPreviewOptions, Offset } from 'angular-skyhook';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy } from '@angular/core';
import { Spot } from '../spot';

@Component({
  selector: 'app-draggable-box',
  template: `
  <div class="root" [dragSource]="source" [ngStyle]="getRootStyles(isDragging$|async)">
    <div class="draggable-node" [ngStyle]="getStyles(isDragging$|async)">
      <app-box></app-box>
    </div>
    <div class="fullsize">
    </div>
  </div>
  <app-crosshairs *ngIf="!(isDragging$|async)" [x]="spot.x" [y]="spot.y"> </app-crosshairs>
  `, styles: [`
  .root {
    cursor: move;
  }
  app-crosshairs, .draggable-node {
    pointer-events: none;
  }
  .fullsize {
    position: absolute;
    left: -400px;
    top: -400px;
    width: 800px;
    height: 800px;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableBoxComponent {

  @Input() spot: Spot;
  @Output() endDrag = new EventEmitter<{ spot: Spot }>();

  source = this.dnd.dragSource<Spot>('BOX', {
    beginDrag: () => {
      return this.spot;
    },
    isDragging: () => {
      return true;
    },
    endDrag: monitor => {
      this.endDrag.emit({ spot: this.spot });
    },
  });

  isDragging$ = this.source.listen(m => m.isDragging());

  constructor(private dnd: SkyhookDndService) { }

  ngOnInit() {
    this.source.connectDragPreview(getEmptyImage(), {
      // for ie11 compat with DragLayer
      captureDraggingState: true
    });
  }

  ngOnDestroy() {
    this.source.unsubscribe();
  }

  getStyles(isDragging: boolean) {
    const { x, y } = this.spot;
    const transform = `translate3d(${x}px, ${y}px, 0)`;

    return {
      position: 'absolute',
    };
  }

  getRootStyles(isDragging: boolean) {
    const { x, y } = this.spot;
    const transform = `translate3d(${x}px, ${y}px, 0)`;

    return {
      position: 'relative',
      marginLeft: `${-16}px`,
      marginTop: `${-16}px`,
      transform,
      WebkitTransform: transform,
      // hide the original element while dragging
      opacity: isDragging ? 0 : null,
      height: isDragging ? 0 : null
    };
  }
}
