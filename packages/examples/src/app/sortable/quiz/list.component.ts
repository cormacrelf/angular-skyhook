import { Component } from "@angular/core";
import { SkyhookDndService } from '@angular-skyhook/core';
import { SortableSpec, DraggedItem, spillTarget } from "@angular-skyhook/sortable";
import { Question, MathQuestion, NameQuestion } from './Question';
import { produce } from 'immer';

@Component({
    selector: 'app-external-sortable',
    styleUrls: ['./list.component.scss'],
    templateUrl: './list.component.html',
})
export class ListComponent {

    // on hover, this will swap out the hover.listId
    // so our <skyhook-preview> knows when to morph back
    spill = spillTarget<Question>(this.dnd, 'QUIZ_QUESTION', {
        drop: item => {
            if (item.isInternal) {
                this.list = this.tempList = this.remove(item);
            }
        }
    });

    // you need data types that have a unique value, like Question.id
    list: Question[] = [
        new MathQuestion(1, 'What is 2+2?', 4),
        new MathQuestion(2, 'What is the meaning of life?', 42),
        new MathQuestion(3, 'What is 1137 mod 256?', 113),
    ];

    nextId = 4;

    // for holding modifications while dragging
    tempList: Question[] = this.list;

    move(item: DraggedItem<Question>) {
        return produce(this.list, draft => {
            if (item.isInternal) {
                draft.splice(item.index, 1);
            }
            draft.splice(item.hover.index, 0, item.data);
        });
    }

    remove(item: DraggedItem<Question>) {
        return produce(this.list, draft => {
            draft.splice(item.index, 1);
        });
    }

    spec: SortableSpec<Question> = {
        type: "QUIZ_QUESTION",
        trackBy: x => x.id,
        hover: item => {
            this.tempList = this.move(item)
        },
        drop: item => { // save the changes
            this.tempList = this.list = this.move(item);
        },
        endDrag: _item => { // revert
            this.tempList = this.list;
        },
    }

    nameBlock: SortableSpec<Question> = {
        ...this.spec,
        createData: () => {
            return new NameQuestion(this.nextId++);
        }
    }

    mathQuestion: SortableSpec<Question> = {
        ...this.spec,
        createData: () => {
            return new MathQuestion(this.nextId++, 'New math question', 0);
        }
    }

    questionTemplates = [
        { spec: this.nameBlock,
          description: NameQuestion.templateDescription },
        { spec: this.mathQuestion,
          description: MathQuestion.templateDescription },
    ];

    constructor(private dnd: SkyhookDndService) {}

    edit(q: Question) {
        const idx = this.list.findIndex(f => f.id === q.id);
        if (idx >= 0) {
            const temp = this.list.slice(0);
            temp.splice(idx, 1, q);
            this.tempList = this.list = temp;
        }
    }

    ngOnDestroy() {
        this.spill.unsubscribe();
    }

}
