import { Component, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: "kanban-add-card",
    template: `
    <form [formGroup]="addForm" >
        <input class="title" placeholder="Add a card" formControlName="title" (keyup.enter)="onSubmit()" />
    </form>
    `,
    styles: [
        `
            .title {
                box-sizing: border-box;
                border: none;
                width: 100%;
                background: rgba(0, 0, 0, 0);
                padding: 6px 8px;
            }
            .title:focus {
                background: #fff;
            }
        `
    ]
})
export class AddCardComponent {
    @Output() add = new EventEmitter<string>();

    addForm = new FormGroup({
        title: new FormControl()
    });

    onSubmit() {
        this.add.emit(this.addForm.get("title").value);
        this.addForm.reset();
    }
}
