import { Component, Input } from "@angular/core";
import { Card } from "./card";

@Component({
    selector: "kanban-card",
    template: `
    <div class="card" [class.card--dragging]="dragging" [class.card--placeholder]="placeholder">
        <p>{{card.title}}</p>
    </div>
    `,
    styleUrls: ['./card.component.scss']
})
export class KanbanCardComponent {
    @Input() card: Card;
    @Input() dragging = false;
    @Input() placeholder = false;
}
