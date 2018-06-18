import {
    Component,
    Input,
    ContentChild,
    TemplateRef,
    Directive,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ContentChildren,
    QueryList,
    OnDestroy,
    AfterContentInit
} from "@angular/core";
import {
    distinctUntilChanged,
    withLatestFrom,
    map,
    startWith,
    tap
} from "rxjs/operators";
import { SkyhookDndService } from "angular-skyhook";
import { Observable, Subscription, BehaviorSubject, Subject } from "rxjs";

import { ItemTypes } from "./item-types";
import { HoverEvent, BeginEvent } from "./hover-event";
import {
    CardRendererDirective,
    CardRendererContext
} from "./card-renderer.directive";
import { DropEvent } from "./drop-event";
import { DraggedItem } from "./dragged-item";
import { Data } from "./data";
import {
    CardPlaceholderDirective,
    CardPlaceholderContext
} from "./card-placeholder.directive";

@Component({
    selector: "skyhook-card-list",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-template #list let-list let-phi="phi">
    </ng-template>

    <ng-container *ngLet="placeholderIndex$|async as phi">
    <ng-container *ngLet="placeholderOver$|async as cardOver">
    <ng-container *ngLet="selfOver$|async as selfOver">

    <div [dropTarget]="target" [dropTargetType]="type" [class]="containerClass"
         [ngStyle]="{ display: 'flex', flexDirection: horizontal ? 'row' : 'column' }">

        <skyhook-card-renderer
            *ngFor="let card of cards; let i = index; trackBy: tracker"
            [index]="i"
            [card]="card"
            [type]="type"
            [listId]="listId"
            [horizontal]="horizontal"
            (hover)="hoverOnCard($event)"
            (begin)="cardBeganDragging($event)"
            [template]="cardRendererTemplates.first"
            [ngStyle]="{ order: i >= phi ? i + 1 : i }"
            >
        </skyhook-card-renderer>

        <ng-container *ngIf="selfOver && (cardOver || isEmpty)">
            <div *ngIf="item$|async as item" [ngStyle]="{ order: phi }">
                <ng-container *ngTemplateOutlet="placeholderTemplates.first; context: { $implicit: item }">
                </ng-container>
            </div>
        </ng-container>

    </div>

    </ng-container>
    </ng-container>
    </ng-container>
    `
})
export class CardListComponent implements OnDestroy, AfterContentInit {
    @Input() listId: any = Math.random();
    @Input() horizontal = false;

    @Input() cards: Array<Data> | Iterable<Data>;

    @Output() dropped = new EventEmitter<DropEvent>();

    @Input() type = ItemTypes.CARD;
    @Input() containerClass = "";

    @ContentChildren(CardPlaceholderDirective, { read: TemplateRef })
    placeholderTemplates: QueryList<TemplateRef<CardPlaceholderContext>>;
    @ContentChildren(CardRendererDirective, { read: TemplateRef })
    cardRendererTemplates: QueryList<TemplateRef<CardRendererContext>>;

    private target = this.dnd.dropTarget<DraggedItem>(null, {
        drop: monitor => {
            const drag = monitor.getItem();
            this.dropEmit$.next(drag);
            this.placeholder$.next({ over: false, index: 0, size: { width: 0, height: 0 } });
        }
    });

    selfOver$ = this.target.listen(m => m.isOver({ shallow: false }));
    item$ = this.target.listen(m => m.getItem());

    dropEmit$ = new Subject<DraggedItem>();
    placeholder$ = new BehaviorSubject({
        over: false,
        index: 0,
        size: { width: 0, height: 0 }
    });
    placeholderIndex$: Observable<number> = this.placeholder$.pipe(
        map(p => p.index),
        distinctUntilChanged()
    );
    placeholderOver$: Observable<boolean> = this.placeholder$.pipe(
        map(p => p.over),
        distinctUntilChanged()
    );

    constructor(private dnd: SkyhookDndService) {
        this.dropEmit$
            .pipe(withLatestFrom(this.placeholderIndex$))
            .subscribe(([drag, phi]) => {
                // noop
                if (
                    drag.listId === this.listId &&
                    (drag.index === phi || drag.index + 1 === phi)
                ) {
                    return;
                }
                this.dropped.emit({
                    id: drag.id,
                    from: {
                        listId: drag.listId,
                        index: drag.index
                    },
                    to: {
                        listId: this.listId,
                        index:
                            drag.listId === this.listId && phi > drag.index
                                ? phi - 1
                                : phi
                    }
                } as DropEvent);
            });
    }

    private cardBeganDragging({ id, index, size }: BeginEvent) {
        this.placeholder$.next({ index, size, over: true });
    }

    private hoverOnCard(evt: HoverEvent) {
        let dim = this.horizontal
            ? evt.hover.size.width
            : evt.hover.size.height;
        const targetCentre = evt.hover.start + dim / 2.0;
        this.placeholder$.next({
            over: true,
            index:
                evt.mouse < targetCentre
                    ? evt.hover.index
                    : evt.hover.index + 1,
            size: evt.source.size
        });
    }

    /** @ignore
     * Returns isEmpty, whether it's an immutable List or an array
     */
    private get isEmpty() {
        if (typeof this.cards["isEmpty"] === 'function') {
            // it's immutable
            return this.cards["isEmpty"]();
        } else if (typeof this.cards["length"] === 'number') {
            // it's an array
            return (this.cards as Array<Data>).length === 0;
        } else {
            return false;
        }
    }

    ngAfterContentInit() {
        if (this.placeholderTemplates.length !== 1) {
            throw new Error("must have exactly one cardPlaceholder template");
        }
        if (this.cardRendererTemplates.length !== 1) {
            throw new Error("must have exactly one cardRenderer template");
        }
    }

    ngOnDestroy() {
        this.target.unsubscribe();
    }

    private tracker(_: number, card: Data) {
        return card.id;
    }
}
