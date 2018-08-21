import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    Optional,
    ViewChild
} from "@angular/core";
import { DragSource } from "angular-skyhook";
import {
    DraggedItem, SortableSpec, CardRendererDirective, CardListDirective
} from "angular-skyhook-card-list";
import { ItemTypes } from "../item-types";
import { Card } from "../card";
import { KanbanList } from "../lists";
import { Observable } from "rxjs";

@Component({
    selector: "kanban-list",
    templateUrl: "./kanban-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./kanban-list.component.scss"]
})
export class KanbanListComponent {
    ItemTypes = ItemTypes;
    @Input() list: KanbanList;
    @Input() spec?: SortableSpec<KanbanList>;
    @Output() addCard = new EventEmitter<string>();

    // we won't use these, but you can listen to any old monitor state if you like.
    // there is a shortcut for m.isDragging() for use in a template, called render?.isDragging$
    placeholder$ = this.render && this.render.source.listen(m => m.isDragging());
    isOver$ = this.render && this.render.target.listen(m => m.canDrop() && m.isOver());

    // You can inject any attached directives in a component
    // - When in the <skyhook-preview>, the directive isn't attached, so make it @Optional()
    // - Also must be public if you're using it in your template, until the Ivy renderer lands
    constructor(@Optional() public render: CardRendererDirective<KanbanList>) { }

    // // If you wanted to listen to properties on the LIST's drop target (to answer
    // // 'is there a card hovering over this kanban-list?'), then you can grab it with a ViewChild.
    // @ViewChild(CardListDirective) cardListSortable: CardListDirective<Card>;
    // cardHovering$: Observable<boolean>;
    // ngAfterViewInit() {
    //     console.log(this.cardListSortable);
    //     if (this.cardListSortable) {
    //         this.cardHovering$ = this.cardListSortable.target.listen(m => m.canDrop() && m.isOver());
    //     }
    // }

    trackById = (_: any, x: Card) =>  x.id;
}
