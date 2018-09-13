import { Component, Input, Output, Optional, EventEmitter } from '@angular/core';
import { SkyhookSortableRenderer } from '@angular-skyhook/sortable';
import { Question } from './Question';

@Component({
    selector: 'quiz-section',
    template: `
    <div class="section"
         [class.section--placeholder]="render?.isDragging$|async"
         [class.section--preview]="preview"
         [dragPreview]="render?.source">

        <span class="section-handle"
            [dragSource]="render?.source"
            [noHTML5Preview]="true">
            &#9776;
        </span>

        <div class="section-content" [ngSwitch]="question.formType">
            <app-math-form *ngSwitchCase="'Math'"
                [data]="question"
                (edit)="edit.emit($event)">
            </app-math-form>
            <div *ngSwitchCase="'Name'">
                Student enters their name/student id
            </div>
        </div>

    </div>
    `,
    styleUrls: ['./section.component.scss']
})
export class SectionComponent {
    @Input() question: Question;
    @Input() preview = false;
    @Output() edit = new EventEmitter();
    constructor(@Optional() public render: SkyhookSortableRenderer<Question>) {}
}
