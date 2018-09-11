import { Component } from "@angular/core";
import * as faker from 'faker';
import { SortableSpec, DraggedItem } from "@angular-skyhook/sortable";
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
    <skyhook-sortable-list class="list"
        ssSortableListId="simple-demo"
        [ssSortableChildren]="tempList"
        [ssSortableSpec]="simpleSpec">

        <ng-template ssTemplate let-context>
            <!-- cardRenderer configures a DragSource for you, but you have to attach it. -->
            <div class="person"
                [ssRender]="context"
                #render="ssRender"
                [class.person--placeholder]="render.isDragging$|async"
                [dragSource]="render.source"> <!-- <<< attached here! -->

                <pre>{{ render.data.name | json }}</pre>
            </div>
        </ng-template>
    </skyhook-sortable-list>
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

    // for holding modifications while dragging
    tempList: SimpleData[] = this.list;

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
        type: "SIMPLE",
        // trackBy is required
        trackBy: x => x.id,
        hover: item => {
            this.tempList = this.move(item)
        },
        drop: item => { // save the changes
            this.tempList = this.list = this.move(item);
        },
        endDrag: item => { // revert
            this.tempList = this.list;
        }
    }

}
