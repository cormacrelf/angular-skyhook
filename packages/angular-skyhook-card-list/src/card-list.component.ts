import {
    Component,
    Input,
    TemplateRef,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ContentChildren,
    QueryList,
    OnDestroy,
    AfterViewInit,
    AfterContentInit,
    HostBinding,
    ElementRef,
    SimpleChange,
} from "@angular/core";
import { DropTarget, SkyhookDndService } from "angular-skyhook";
import { Subscription, Observable } from "rxjs";

import { ItemTypes } from "./item-types";
import { DraggedItem } from "./dragged-item";
import { Data } from "./data";

import {
    CardTemplateDirective,
    CardTemplateContext
} from "./card-template.directive";

import { SortableSpec } from "./SortableSpec";
import { isEmpty } from './isEmpty';

@Component({
    selector: "skyhook-card-list",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-container *ngLet="item$|async as item">
    <ng-container *ngFor="let card of children;
                          let i = index;
                          trackBy: tracker" >
        <ng-container
            *ngTemplateOutlet="cardRendererTemplates.first;
            context: {
                $implicit: {
                    data: card,
                    index: i,
                    item: item && item.id === card.id && item,
                    isDragging: item && item.id === card.id,
                    listId: listId,
                    type: type,
                    spec: spec,
                    horizontal: horizontal
                }
            }">
        </ng-container>
    </ng-container>
    </ng-container>
    `,

    styles: [`
    :host {
        display: flex;
    }
    `]
})
export class CardListComponent implements OnDestroy, AfterContentInit, AfterViewInit {
    @Input() listId: any = Math.random();
    @Input() horizontal = false;
    @Input() children!: Array<Data> | Iterable<Data>;
    @Input() type = ItemTypes.CARD;
    @Input() spec!: SortableSpec;

    @Output() drop = new EventEmitter<DraggedItem>();
    @Output() beginDrag = new EventEmitter<DraggedItem>();
    @Output() hover = new EventEmitter<DraggedItem>();
    @Output() endDrag = new EventEmitter<DraggedItem>();

    @ContentChildren(CardTemplateDirective, {
        read: TemplateRef
    })
    cardRendererTemplates!: QueryList<TemplateRef<CardTemplateContext>>;

    /** @ignore */
    @HostBinding('style.flexDirection')
    get flexDirection() {
        return this.horizontal ? 'row': 'column';
    }

    get isEmpty() {
        return isEmpty(this.children);
    }

    subs = new Subscription();

    /** @ignore */
    target: DropTarget<DraggedItem> = this.dnd.dropTarget<DraggedItem>(null, {
        canDrop: monitor => {
            if (monitor.getItemType() !== this.type) {
                return false;
            }
            const item = monitor.getItem();
            if (!item) { return false; }
            if (this.spec && this.spec.canDrop) {
                return this.spec.canDrop(item);
            }
            return true;
        },
        drop: monitor => {
            const item = monitor.getItem();
            if (!item) { return; }
            if (this.spec && this.spec.canDrop && !this.spec.canDrop(item)) {
                return;
            }
            this.spec && this.spec.drop && this.spec.drop(item);
            this.drop.emit(item);
        },
        hover: monitor => {
            const item = monitor.getItem();
            if (this.isEmpty && item) {
                let canDrop = true;
                if (this.spec && this.spec.canDrop) {
                    canDrop = this.spec.canDrop(item);
                }
                if (canDrop) {
                    item.hover = {
                        listId: this.listId,
                        index: 0
                    };
                    this.spec && this.spec.hover && this.spec.hover(item);
                }
            }
        }
    }, this.subs);

    item$: Observable<DraggedItem | null> = this.target.listen(m => m.canDrop() && m.getItem() || null);
    isOver$: Observable<boolean> = this.target.listen(m => m.canDrop() && m.isOver());

    constructor(
        private dnd: SkyhookDndService,
        private el: ElementRef<HTMLElement>,
    ) {
    }

    /** @ignore */
    ngAfterViewInit() {
        if (this.el) {
            this.target.connectDropTarget(this.el.nativeElement);
        } else {
            throw new Error('must have ElementRef');
        }
    }

    /** @ignore */
    ngAfterContentInit() {
        if (this.cardRendererTemplates.length !== 1) {
            throw new Error("must have exactly one cardRenderer template");
        }
    }

    ngOnChanges(changes: { type?: SimpleChange }) {
        // console.log('CardList', changes);
        if (changes.type) {
            this.target.setTypes(changes.type.currentValue);
        }
    }

    /** @ignore */
    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    /** @ignore */
    tracker(_: number, card: Data) {
        return card.id;
    }
}
