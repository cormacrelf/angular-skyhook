import { getEmptyImage } from 'react-dnd-html5-backend';
import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    Input,
    EventEmitter,
    Output,
    ElementRef
} from '@angular/core';
import { snapToGrid } from './snapToGrid';
import { SkyhookDndService, Offset } from "@angular-skyhook/core";
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Spot } from '../spot';
import { Rect, alongEdge, plus, minus, clone, fmap } from '../vectors';

interface Collected {
    item: Spot;
    itemType: string | symbol;
    isDragging: boolean;
    initialOffset: Offset;
    currentOffset: Offset;
}

@Component({
    selector: 'xy-custom-drag-layer',
    template: `
  <ng-container *ngIf="(collect$|async) as c">
  <ng-container *ngIf="c.isDragging">

    <xy-crosshairs *ngIf="crossStyle$|async as cross"
      [x]="cross.x"
      [y]="cross.y">
    </xy-crosshairs>

    <div [ngStyle]="movingStyle$|async">
      <ng-container [ngSwitch]="c.itemType">
        <xy-box-drag-preview *ngSwitchCase="'SPOT'"
          [title]="c.item.title">
        </xy-box-drag-preview>
      </ng-container>
    </div>

  </ng-container>
  </ng-container>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./custom-drag-layer.component.scss']
})
export class CustomDragLayerComponent {
    @Input() snapToGrid = false;

    snappingFunction = snapToGrid(32);
    @Input()
    set incrementPx(n: number) {
        this.snappingFunction = snapToGrid(n);
    }

    @Output() moved = new EventEmitter<Offset>();

    rect: Rect = { x: 0, y: 0, width: 0, height: 0 };

    dragLayer = this.dnd.dragLayer<Spot>();

    collect$ = this.dragLayer.listen(monitor => {
        this.setWindowRelativeOffset();
        return {
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            isDragging: monitor.isDragging(),
            initialOffset: this.absToRelative(
                monitor.getInitialSourceClientOffset()
            ),
            currentOffset: this.absToRelative(monitor.getSourceClientOffset())
        } as Collected;
    });

    movingStyle$ = this.collect$.pipe(
        map(c => this.getItemStyles(c)),
        filter(x => x != null)
    );

    crossStyle$ = this.collect$.pipe(
        map(c => this.getCrosshairStyles(c)),
        filter(a => a != null)
    );

    constructor(private dnd: SkyhookDndService, private el: ElementRef) {}

    absToRelative(abs: Offset): Offset {
        return abs && minus(abs, this.rect);
    }

    setWindowRelativeOffset() {
        let o = (this.el.nativeElement as Element).getBoundingClientRect();
        this.rect = {
            x: o.left,
            y: o.top,
            width: o.width,
            height: o.height
        };
    }

    getXY(
        spot: Spot,
        initialOffset: Offset,
        currentOffset: Offset,
        emit = false
    ): Offset {
        let offset = clone(currentOffset);

        let diff = minus(currentOffset, initialOffset);

        if (this.snapToGrid) {
            offset = minus(offset, initialOffset);
            offset = this.snappingFunction(offset);
            diff = offset;
            offset = plus(offset, initialOffset);
        }

        if (spot.fromCube) {
            let absoluteUsingOriginalSpot = plus(
                spot,
                minus(diff, { x: 16, y: 16 })
            );
            let clipped = this.getClippedOffset(absoluteUsingOriginalSpot);
            emit && this.moved.emit(clipped);
            return clipped;
        }

        let clipped = this.getClippedOffset(offset);
        emit && this.moved.emit(clipped);
        return clipped;
    }

    getClippedOffset(a: Offset) {
        // you always get x and y relative to the top left of a dragged item.
        // we compensate in the <box-drag-preview>, but we also have to compensate
        // for the size of the original draggable-box such that its centre point can be at (0,0) .
        let b = plus(a, { x: 16, y: 16 });
        return alongEdge(this.rect.width, this.rect.height, b.x, b.y);
    }

    getItemStyles({ item, initialOffset, currentOffset }: Collected) {
        if (!initialOffset || !currentOffset) {
            return {
                display: 'none'
            };
        }

        let { x, y } = this.getXY(item, initialOffset, currentOffset, true);
        const transform = `translate3d(${x}px, ${y}px, 0)`;
        return {
            transform,
            WebkitTransform: transform
        };
    }

    getCrosshairStyles({ item, initialOffset, currentOffset }: Collected) {
        if (!initialOffset || !currentOffset) {
            return null;
        }
        let clipped = this.getXY(item, initialOffset, currentOffset);
        return fmap(Math.round, clipped);
    }

    ngAfterViewInit() {
        this.setWindowRelativeOffset();
    }

    ngOnDestroy() {
        this.dragLayer.unsubscribe();
    }
}
