import { Component } from '@angular/core';

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
export class ContainerComponent {
}