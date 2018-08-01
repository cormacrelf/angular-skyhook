import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'xy-box',
    template: ` <div class="spot" [class.compensate]="compensate"></div> `,
    styles: [
        `
            .spot {
                background: #33e8d5;
                box-shadow: 0 0 8px #33e8d5;
                cursor: move;
                padding: 16px;
                border-radius: 16px;
            }
            .compensate {
                margin-left: -16px;
                margin-top: -16px;
            }
        `
    ]
})
export class SpotComponent {
    @Input() compensate = false;
}
