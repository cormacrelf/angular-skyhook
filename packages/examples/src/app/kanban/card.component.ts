import { Component, Input } from "@angular/core";
import { Card } from "./card";

@Component({
    selector: "kanban-card",
    template: `
    <div class="card" [class.dragging]="dragging">
        <p>{{card.title}}</p>
    </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }
            * {
                box-sizing: border-box;
            }
            .card {
                background: #fff;
                padding: 8px;
                border-radius: 4px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08),
                    0 1px 2px rgba(0, 0, 0, 0.16);
            }
            .card p {
                margin: 0;
            }
            .dragging {
                transform: rotate(-2deg);
                width: 100%;
                height: 100%;
                box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
                    0 10px 10px rgba(0, 0, 0, 0.22);
            }
        `
    ]
})
export class KanbanCardComponent {
    @Input() card: Card;
    @Input() dragging: boolean;
}
