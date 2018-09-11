import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SkyhookDndService, Offset } from "@angular-skyhook/core";
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Spot } from './spot';

@Component({
    selector: 'xy-cube',
    template: `
    <section class="container" [dragSource]="source" [noHTML5Preview]="true" >
        <div id="cube" [ngStyle]="{ transform: transform, WebkitTransform: transform }">
            <figure class="front">1</figure>
            <figure class="back">2</figure>
            <figure class="right">3</figure>
            <figure class="left">4</figure>
            <figure class="top">5</figure>
            <figure class="bottom">6</figure>
        </div>
    </section>
    `,
    styles: [
        `
            .container {
                width: 200px;
                height: 200px;
                position: relative;
                perspective: 1000px;
            }

            #cube {
                width: 100%;
                height: 100%;
                position: absolute;
                transform-style: preserve-3d;
            }

            #cube figure {
                margin: 0;
                width: 196px;
                height: 196px;
                display: block;
                position: absolute;
                border: 2px solid black;
                font-size: 68px;
                text-align: center;
                line-height: 196px;
            }
            #cube .front {
                transform: rotateY(0deg) translateZ(100px);
                background: #225378;
            }
            #cube .back {
                transform: rotateX(180deg) translateZ(100px);
                background: #1695a3;
            }
            #cube .right {
                transform: rotateY(90deg) translateZ(100px);
                background: #acf0f2;
            }
            #cube .left {
                transform: rotateY(-90deg) translateZ(100px);
                background: #f3ffe2;
            }
            #cube .top {
                transform: rotateX(90deg) translateZ(100px);
                background: #eb7f00;
            }
            #cube .bottom {
                transform: rotateX(-90deg) translateZ(100px);
                background: #b0121b;
            }
        `
    ]
})
export class CubeComponent {
    @Input() transform: string;
    @Input() x: number;
    @Input() y: number;
    @Output() endDrag = new EventEmitter<void>();
    source = this.dnd.dragSource<Spot>('SPOT', {
        beginDrag: () => {
            return { id: 123, x: this.x, y: this.y, fromCube: true };
        },
        endDrag: monitor => {
            this.endDrag.emit();
        }
    });
    constructor(private dnd: SkyhookDndService) {}
}
