import { Component } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";
import { ItemTypes } from './constants';
import { horseImage } from './horseImage';

@Component({
    selector: 'app-knight',
    template: `<span [dragSource]="knightSource" [class.dragging]="isDragging$|async">♘</span>`,
    styleUrls: ['./knight.component.scss']
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
        img.onload = () => this.knightSource.connectDragPreview(img);
    }

    ngOnDestroy() {
        this.knightSource.unsubscribe();
    }

}
