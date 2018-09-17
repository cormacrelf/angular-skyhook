import { Component } from '@angular/core';

@Component({
    selector: 'app-chess-container',
    template: `
    <app-example-link path="chessboard"></app-example-link>

    <p>Welcome to <code>@angular-skyhook</code>.</p>
    <p>This is a re-implementation of the original, classic <a href="http://react-dnd.github.io/react-dnd/examples-chessboard-tutorial-app.html">react-dnd demo</a>.</p>
    <p>The whole tutorial has been re-written so you can <a href="https://cormacrelf.github.io/angular-skyhook/additional-documentation/chess-tutorial.html">follow along</a> and build this yourself.</p>

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
