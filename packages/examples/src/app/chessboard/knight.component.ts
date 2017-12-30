import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DndService } from 'angular-hovercraft';
import { ItemTypes } from './constants';
import { horseImage } from './horseImage';

@Component({
    selector: 'app-knight',
    template: `<span [dragSource]="knightSource" [class.dragging]="isDragging$|async">♘</span>`,
    styles: [`
    span {
        font-weight: 700;
        font-size: 54px;
        line-height: 63px;
        cursor: move;
    }
    .dragging {
        opacity: 0.25;
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Knight {
    knightSource = this.dnd.dragSource(ItemTypes.KNIGHT, {
        beginDrag: () => ({})
    });
    isDragging$ = this.knightSource.listen(m => m.isDragging());

    constructor(private dnd: DndService) { }
    ngOnInit() {
        const img = new Image();
        img.src = horseImage;
        img.onload = () => this.knightSource.connect(c => c.dragPreview(img));
    }
    ngOnDestroy() {
        this.knightSource.unsubscribe();
    }
}
