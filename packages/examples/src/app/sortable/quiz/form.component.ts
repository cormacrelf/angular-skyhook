import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MathQuestion, NameAndStudentId } from './FormData';

@Component({
    selector: "app-math-form",
    template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" >
    <div>
        <label>
            Question:
            <input class="title" placeholder="Add a card" formControlName="question" />
        </label>
    </div>
    <div>
        <label>
            Answer:
            <input class="amount" type="number" formControlName="answer"/>
        </label>
    </div>
    <div>
    <input type="submit" value="Save question" *ngIf="form.dirty" />
    </div>
    </form>
    `
})
export class MathFormComponent {
    @Input() data: MathQuestion;
    @Output() edit = new EventEmitter<MathQuestion>();

    form: FormGroup;

    ngOnChanges() {
        this.form = new FormGroup({
            question: new FormControl(this.data.question),
            answer: new FormControl(this.data.answer),
        });
    }

    onSubmit() {
        this.edit.emit(new MathQuestion(
            this.data.id,
            this.form.get("question").value as string,
            this.form.get("answer").value as number
        ));
    }
}

@Component({
    selector: "app-name-form",
    template: `
    <form [formGroup]="form" >
    <div>
        <label>
            Student enters name and student ID
        </label>
    </div>
    </form>
    `
})
export class NameFormComponent {
    @Input() data: NameAndStudentId;
    @Output() edit = new EventEmitter<NameAndStudentId>();

    form: FormGroup;

    ngOnChanges() {
        this.form = new FormGroup({
            name: new FormControl(this.data.name),
            studentId: new FormControl(this.data.studentId),
        });
    }

    onSubmit() {
        this.edit.emit(new NameAndStudentId(
            this.data.id,
            this.form.get("name").value as string,
            this.form.get("studentId").value as string
        ));
    }
}
