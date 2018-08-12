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
    ChangeDetectorRef,
} from "@angular/core";
import { DropTarget, SkyhookDndService } from "angular-skyhook";
// @ts-ignore
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
                          trackBy: trackBy" >
        <ng-container
            *ngTemplateOutlet="template;
            context: {
                $implicit: {
                    data: card,
                    index: i,
                    item: item && item.id === card.id && item,
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
    @Input() type: string | symbol = ItemTypes.CARD;
    @Input() spec!: SortableSpec;

    @Output() drop = new EventEmitter<DraggedItem>();
    @Output() beginDrag = new EventEmitter<DraggedItem>();
    @Output() hover = new EventEmitter<DraggedItem>();
    @Output() endDrag = new EventEmitter<DraggedItem>();

    @Input() template?: TemplateRef<CardTemplateContext>;

    @ContentChildren(CardTemplateDirective, {
        read: TemplateRef
    })
    set cardRendererTemplates(ql: QueryList<TemplateRef<CardTemplateContext>>) {
        if (ql.length > 0) {
            this.template = ql.first;
        }
    };

    /** @ignore */
    @HostBinding('style.flexDirection')
    /** @ignore */
    get flexDirection() {
        return this.horizontal ? 'row': 'column';
    }

    /** @ignore */
    get isEmpty() {
        return isEmpty(this.children);
    }

    /** @ignore */
    subs = new Subscription();

    // #<{(|* @ignore |)}>#
    // bodyTarget: DropTarget<DraggedItem>;
    // createBodyTarget = () => this.bodyTarget = this.dnd.dropTarget<DraggedItem>(this.type, {
    //     drop: (monitor) => {
    //         if (!monitor.didDrop()) {
    //             console.log('dropped on body target, calling endDrag');
    //             this.spec && this.spec.endDrag && this.spec.endDrag(monitor.getItem());
    //         }
    //     },
    //     hover: monitor => {
    //         const item = monitor.getItem();
    //         if (!monitor.isOver({ shallow: true })) return;
    //         if (!item.isInternal) {
    //             console.log('external hover handled', this.listId);
    //         }
    //         const { revertOnSpill, removeOnSpill } = this.spec;
    //         const canDrop = this.getCanDrop(item);
    //         // revert case
    //         if (revertOnSpill !== false && canDrop && monitor.isOver({ shallow: true })) {
    //             this.callHover(item, {
    //                 listId: this.listId,
    //                 index: item.index,
    //             });
    //             return;
    //         }
    //         // TODO: handle removeOnSpill
    //     }
    // }, this.subs);

    /** @ignore */
    private getCanDrop(item: DraggedItem, _default = true) {
        if (this.spec && this.spec.canDrop) {
            return this.spec.canDrop(item);
        }
        return _default;
    }

    callHover(item: DraggedItem, newHover?: { listId: any; index: number; }) {
        if (newHover) {
            item.hover = newHover;
        }
        this.spec && this.spec.hover && this.spec.hover(item);
    }

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
            if (item && this.getCanDrop(item)) {
                this.spec && this.spec.drop && this.spec.drop(item);
                this.drop.emit(item);
            }
            return {};
        },
        hover: monitor => {
            const item = monitor.getItem();
            if (this.isEmpty && item) {
                const canDrop = this.getCanDrop(item);
                if (canDrop && monitor.isOver({ shallow: true })) {
                    this.callHover(item, {
                        listId: this.listId,
                        index: 0,
                    });
                }
            }
        }
    }, this.subs);

    item$ = this.target.listen(m => m.canDrop() && m.getItem() || null);
    isOver$ = this.target.listen(m => m.canDrop() && m.isOver());

    constructor(
        private dnd: SkyhookDndService,
        public cdr: ChangeDetectorRef,
        private el: ElementRef<HTMLElement>,
    ) {
    }

    updateChildren(updated: Array<Data>) {
        this.children = updated;
        this.cdr.markForCheck();
    }

    updateType(newtype: string | symbol) {
        this.type = newtype;
        this.cdr.markForCheck();
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
        if (!this.template) {
            throw new Error("You must provide a <ng-template cardTemplate> as a content child, or with [template]=\"myTemplateRef\"")
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
    trackBy = (_: number, card: Data) => {
        return this.spec && this.spec.trackBy(card);
    }
}
