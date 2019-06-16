import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    Optional,
} from "@angular/core";
import { DragSource } from "@angular-skyhook/core";
import {
    DraggedItem, SortableSpec, SkyhookSortableRenderer
} from "@angular-skyhook/sortable";
import { Card } from "../card";
import { KanbanList } from "../lists";
import { Observable } from "rxjs";
import { SortableSpecService } from '../specs';

@Component({
    selector: "kanban-list",
    templateUrl: "./kanban-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./kanban-list.component.scss"]
})
export class KanbanListComponent {
    @Input() list: KanbanList;
    @Input() preview = false;
    @Output() addCard = new EventEmitter<string>();

    // we won't use these, but you can listen to any old monitor state if you like.
    // there is a shortcut for m.isDragging() for use in a template, called render?.isDragging$
    placeholder$ = this.render && this.render.source.listen(m => m.isDragging());
    isOver$ = this.render && this.render.target.listen(m => m.canDrop() && m.isOver());

    // You can inject any attached directives in a component
    // - When in the <skyhook-preview>, the directive isn't attached, so make it @Optional()
    // - Also must be public if you're using it in your template, until the Ivy renderer lands
    constructor(
        public specs: SortableSpecService,
        @Optional() public render: SkyhookSortableRenderer<KanbanList>,
    ) { }

    ngOnInit() {
    }

    // // If you wanted to listen to properties on the LIST's drop target (to answer
    // // 'is there a card hovering over this kanban-list?'), then you can grab it with a ViewChild.
    // @ViewChild(SkyhookSortable) sortable: SkyhookSortable<Card>;
    // cardHovering$: Observable<boolean>;
    // ngAfterViewInit() {
    //     console.log(this.sortable);
    //     if (this.sortable) {
    //         this.cardHovering$ = this.sortable.target.listen(m => m.canDrop() && m.isOver());
    //     }
    // }

    trackById = (_: any, x: Card) =>  x.id;
}
