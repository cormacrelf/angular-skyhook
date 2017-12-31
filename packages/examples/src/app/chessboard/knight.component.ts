import { Component } from '@angular/core';
import { SkyhookDndService } from 'angular-skyhook';
import { ItemTypes } from './constants';
import { horseImage } from './horseImage';

@Component({
    selector: 'app-knight',
    template: `<span [dragSource]="knightSource" [class.dragging]="isDragging$|async">♘</span>`,
    styles: [`
    span {
        font-weight: 400;
        font-size: 54px;
        line-height: 70px;
        cursor: move;
    }
    .dragging {
        opacity: 0.25;
    }
    `]
})
export class KnightComponent {

    knightSource = this.dnd.dragSource(ItemTypes.KNIGHT, {
        beginDrag: () => ({})
    });

    isDragging$ = this.knightSource.listen(m => m.isDragging());

    constructor(private dnd: SkyhookDndService) { }

    ngOnInit() {
        const img = new Image();
        img.src = horseImage;
        img.onload = () => this.knightSource.connect(c => c.dragPreview(img));
    }

    ngOnDestroy() {
        this.knightSource.unsubscribe();
    }

}
