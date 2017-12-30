import { Component } from '@angular/core';
import { GameService } from './game.service';

@Component({
    selector: 'app-chess-container',
    template: `
    <div class="container">
        <app-board></app-board>
    </div>
    `, styles: [`
    .container { 
        width: 560px;
        height: 560px;
    }
    `]
})
export class Container {
    constructor(game: GameService) {
    }
}