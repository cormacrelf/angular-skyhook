import { Component, Input } from '@angular/core';
import { FormData, FormTypes, MathQuestion, NameAndStudentId } from './FormData';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

interface Section {
    template: FormData;
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
            <ng-container [ngSwitch]="section.template.formType">
                <div *ngSwitchCase="'MathQuestion'">
                    <h3>{{section.template.question}}</h3>
                    <form [formGroup]="section.input">
                        <input formControlName="answer" type="number" />
                        <div *ngIf="section.input.get('answer') as answer" class="alert alert-danger">
                            <div *ngIf="answer.invalid && (answer.touched || answer.dirty) && answer.errors.incorrect">That's not quite right.</div>
                            <div *ngIf="answer.valid">Correct!</div>
                        </div>
                    </form>
                </div>
                <div *ngSwitchCase="'NameAndStudentId'">
                    <h3>Enter your Name and Student Id</h3>
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
    @Input() set formElements(forms: FormData[]) {
        this.sections = forms.map(f => {
            return {
                template: f,
                input: this.getFormGroup(f),
            }
        });
    }

    getFormGroup(template: FormData) {
        switch (template.formType) {
            case FormTypes.MathQuestion: {
                return new FormGroup({
                    answer: new FormControl(null, [
                        Validators.required,
                        equalsValidator(template.answer)
                    ])
                });
            }
            case FormTypes.NameAndStudentId: {
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

