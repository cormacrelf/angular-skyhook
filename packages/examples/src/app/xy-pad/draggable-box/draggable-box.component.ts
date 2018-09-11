import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ChangeDetectionStrategy } from '@angular/core';
import { Spot } from '../spot';

@Component({
    selector: 'xy-draggable-box',
    template: `
  <div class="root" [dragSource]="source" [ngStyle]="getRootStyles(isDragging$|async)">
    <div class="draggable-node">
      <xy-box></xy-box>
    </div>
    <div class="fullsize">
    </div>
  </div>
    <xy-crosshairs *ngIf="!(isDragging$|async)" [x]="spot.x" [y]="spot.y"> </xy-crosshairs>
  `,
    styles: [
        `
            .root {
                cursor: move;
            }
            xy-crosshairs,
            .draggable-node {
                pointer-events: none;
                position: absolute;
            }
            xy-crosshairs { margin-top: 16px; }
            .fullsize {
                position: absolute;
                left: -400px;
                top: -400px;
                width: 800px;
                height: 800px;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableBoxComponent {
    @Input() spot!: Spot;
    @Output() endDrag = new EventEmitter<Spot>();

    source = this.dnd.dragSource<Spot>('SPOT', {
        beginDrag: () => {
            return this.spot;
        },
        isDragging: () => {
            return true;
        },
        endDrag: () => {
            this.endDrag.emit(this.spot);
        }
    });

    isDragging$ = this.source.listen(m => m.isDragging());

    constructor(private dnd: SkyhookDndService) {}

    ngOnInit() {
        this.source.connectDragPreview(getEmptyImage(), {
            // for ie11 compat with DragLayer
            captureDraggingState: true
        });
    }

    ngOnDestroy() {
        this.source.unsubscribe();
    }

    getStyles() {
        return ;
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
