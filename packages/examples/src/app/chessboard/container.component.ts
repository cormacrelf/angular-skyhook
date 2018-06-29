import { Component } from '@angular/core';

@Component({
    selector: 'app-chess-container',
    template: `
    <app-example-link path="chessboard"></app-example-link>
    <div class="max-container">
    <div class="square-outer">
        <div class="square-inner">
            <app-board></app-board>
        </div>
    </div>
    </div>
    `, styles: [`
    :host ::ng-deep * { box-sizing: border-box; }
    .max-container {
        max-width: 560px;
    }
    .square-outer {
        height: 0;
        padding-bottom: 100%;
        position: relative;
        overflow: hidden;
    }
    .square-inner {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: 100%;
    }
    `]
})
export class ContainerComponent {
}