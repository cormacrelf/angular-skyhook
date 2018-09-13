import { Component, Input } from '@angular/core';
import { Question, QuestionTypes, MathQuestion } from './Question';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

interface Section {
    question: Question;
    input: FormGroup;
}

const equalsValidator: (x: any) => ValidatorFn = (x) => (c) => {
    return c.value === x ? null : { incorrect: true }
};

@Component({
    selector: 'app-printout',
    template: `
    <div class="printout-page">
        <div class="printout-elem" *ngFor="let section of sections">
            <ng-container [ngSwitch]="section.question.formType">
                <div *ngSwitchCase="'Math'">
                    <h4>{{section.question.question}}</h4>
                    <form [formGroup]="section.input">
                        <input formControlName="answer" type="number" />
                        <div *ngIf="section.input.get('answer') as answer" class="alert alert-danger">
                            <div *ngIf="answer.invalid && (answer.touched || answer.dirty) && answer.errors.incorrect">That's not quite right.</div>
                            <div *ngIf="answer.valid">Correct!</div>
                        </div>
                    </form>
                </div>
                <div *ngSwitchCase="'Name'">
                    <h4>Enter your Name and Student Id</h4>
                    <form [formGroup]="section.input">
                        <label> Name <input formControlName="name" /> </label>
                        <label> Student ID <input formControlName="studentId" /> </label>
                        <div *ngIf="section.input.get('studentId') as studentId" class="alert alert-danger">
                            <div *ngIf="studentId.invalid && (studentId.touched || studentId.dirty) && studentId.errors.pattern">Please enter a student ID in the form 's1234'.</div>
                        </div>
                    </form>
                </div>
            </ng-container>
        </div>
    </div>
    `,
    styles: [`
        .ng-valid:not(form)  {
            border-left: 5px solid #42A948; /* green */
        }
        .ng-invalid:not(form)  {
            border-left: 5px solid #a94442; /* red */
        }
    `]
})
export class PrintoutComponent {
    sections: Section[];
    @Input() set formElements(forms: Question[]) {
        this.sections = forms.map(q => {
            return {
                question: q,
                input: this.getFormGroup(q),
            }
        });
    }

    getFormGroup(question: Question) {
        switch (question.formType) {
            case QuestionTypes.Math: {
                return new FormGroup({
                    answer: new FormControl(null, [
                        Validators.required,
                        equalsValidator(question.answer)
                    ])
                });
            }
            case QuestionTypes.Name: {
                return new FormGroup({
                    name: new FormControl(null, [
                        Validators.required,
                    ]),
                    studentId: new FormControl(null, [
                        Validators.required,
                        Validators.pattern(/^s\d{4}$/)
                    ])
                });
            }
        }
    }
}
