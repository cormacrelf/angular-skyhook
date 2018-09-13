import { Component } from "@angular/core";
import { SkyhookDndService } from '@angular-skyhook/core';
import { SortableSpec, DraggedItem, EXTERNAL_LIST_ID, spillTarget } from "@angular-skyhook/sortable";
import { Question, MathQuestion, NameQuestion } from './Question';

@Component({
    selector: 'app-external-sortable',
    styleUrls: ['./list.component.scss'],
    templateUrl: './list.component.html',
})
export class ListComponent {

    EXTERNAL = EXTERNAL_LIST_ID;
    spill = spillTarget<Question>(this.dnd, 'QUIZ_QUESTION', {
        // on hover, this will swap out the hover.listId
        // so our <skyhook-preview> knows when to morph back
        drop: item => {
            if (item.isInternal) {
                this.list = this.tempList = this.remove(item);
            }
        }
    });

    // you need data types that have a unique value, like FormData.id
    list: Question[] = [
        new NameQuestion(1, 'Student Name', 's1234'),
        new MathQuestion(2, 'What is 2+2?', 4),
        new MathQuestion(3, 'What is the meaning of life?', 42),
        new MathQuestion(4, 'What is 1137 mod 256?', 113),
    ];

    nextId = 5;

    // for holding modifications while dragging
    tempList: Question[] = this.list;

    move(item: DraggedItem<Question>) {
        // shallow clone the list
        // do this so we can avoid overwriting our 'saved' list.
        const temp = this.list.slice(0);
        // DIFFERENT: CHECK IF THE ITEM IS 'INTERNAL' OR NOT
        // if it's not internal, it does not need to be deleted from the list
        if (item.isInternal) {
            temp.splice(item.index, 1);
        }
        // add it back in at the new location
        temp.splice(item.hover.index, 0, item.data);
        return temp;
    }

    remove(item: DraggedItem<Question>) {
        const temp = this.list.slice(0);
        temp.splice(item.index, 1);
        return temp;
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
            return new NameQuestion(this.nextId++, 'Student Name', 's1428');
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

}
