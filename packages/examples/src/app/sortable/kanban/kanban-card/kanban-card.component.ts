import { Component, Input } from "@angular/core";
import { Card } from "../card";

@Component({
    selector: "kanban-card",
    template: `
    <div class="card"
        [class.card--preview]="preview"
        [class.card--placeholder]="placeholder">
        <p>{{card.title}}</p>
    </div>
    `,
    styleUrls: ['./kanban-card.component.scss']
})
export class KanbanCardComponent {
    @Input() card: Card;
    @Input() preview = false;
    @Input() placeholder = false;
}
