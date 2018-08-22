import { Component } from "@angular/core";
import * as faker from 'faker';
import { SortableSpec, DraggedItem } from "angular-skyhook-card-list";
import { BehaviorSubject } from "rxjs";

interface SimpleData {
    id: number;
    name: string;
}

@Component({
    selector: 'app-simple-sortable',
    styleUrls: ['./simple.component.scss'],
    template: `
    <!-- this thing will make a list for you, using simpleSpec.getList(), and the cardTemplate provided. -->
    <skyhook-card-list class="list"
        cardListType="SIMPLE"
        cardListId="simple-demo"
        [cardListSpec]="simpleSpec">

        <ng-template cardTemplate let-context>
            <!-- cardRenderer configures a DragSource for you, but you have to attach it. -->
            <div class="card"
                [cardRenderer]="context"
                #render="cardRenderer"
                [class.placeholder]="render.isDragging$|async"
                [dragSource]="render.source"> <!-- <<< attached here! -->

                <pre>{{ render.data.name | json }}</pre>
            </div>
        </ng-template>
    </skyhook-card-list>
    `,
})
export class SimpleComponent {

    // you need data types that have a unique value, like SimpleData.id
    list: SimpleData[] = [
        { id: 1, name: faker.name.firstName() },
        { id: 2, name: faker.name.firstName() },
        { id: 3, name: faker.name.firstName() },
        { id: 4, name: faker.name.firstName() },
        { id: 5, name: faker.name.firstName() },
    ];

    // BehaviorSubject is great for simple pieces of changing state.
    // It will happily replay the latest value to new subscribers, and behaves a bit
    // like an @ngrx/store does.
    list$ = new BehaviorSubject(this.list);

    move(item: DraggedItem<SimpleData>) {
        // shallow clone the list
        // do this so we can avoid overwriting our 'saved' list.
        const temp = this.list.slice(0);
        // delete where it was previously
        temp.splice(item.index, 1);
        // add it back in at the new location
        temp.splice(item.hover.index, 0, item.data);
        return temp;
    }

    simpleSpec: SortableSpec<SimpleData> = {
        // required.
        trackBy: x => x.id,
        // required. MUST return an Observable.
        // conceptually, this.list$ is in flux, but this.list is the 'saved' version.
        getList: _listId => this.list$,
        hover: (item) => {
            // fire off a new list$ but don't save yet
            this.list$.next(this.move(item));
        },
        drop: (item) => {
            // 'save the changes'
            this.list = this.move(item);
            this.list$.next(this.list);
        },
        endDrag: item => {
            // revert
            this.list$.next(this.list);
        }
    }

}
