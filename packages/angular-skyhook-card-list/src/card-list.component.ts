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
    AfterContentInit,
    ElementRef,
    SimpleChange,
    SimpleChanges
} from "@angular/core";
import {
    distinctUntilChanged,
    withLatestFrom,
    map,
    startWith,
    tap
} from "rxjs/operators";
import { SkyhookDndService, DragSourceSpec } from "angular-skyhook";
import { Observable, Subscription, BehaviorSubject, Subject } from "rxjs";

import { ItemTypes } from "./item-types";
import { HoverEvent, BeginEvent } from "./hover-event";
import { DropEvent } from "./drop-event";
import { DraggedItem } from "./dragged-item";
import { Data } from "./data";

import {
    CardTemplateDirective,
    CardTemplateContext
} from "./card-template.directive";
import {
    PlaceholderTemplateDirective,
    PlaceholderTemplateContext
} from "./card-placeholder.directive";

import { DropTarget } from 'angular-skyhook';
import { HostBinding } from "@angular/core";
import { CardListService } from "./service";
import { Size } from "./size";

@Component({
    selector: "skyhook-card-list",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ CardListService ],
    template: `
    <ng-container *ngLet="placeholderIndex$|async as phi">
    <ng-container *ngLet="placeholderOver$|async as cardOver">
    <ng-container *ngLet="selfOver$|async as selfOver">

    <ng-container
        *ngFor="let card of cards; let i = index; trackBy: tracker"
        >
        <ng-container *ngTemplateOutlet="cardRendererTemplates.first; context: { $implicit: { card: card, index: i, order: i >= phi ? i + 1 : i, listId: listId, type: type, horizontal: horizontal } }">
        </ng-container>
    </ng-container>

    <ng-container *ngIf="(selfOver && (cardOver || isEmpty) && (item$|async)) as item">
        <ng-container *ngTemplateOutlet="placeholderTemplates.first; context: { $implicit: { item: item, order: phi, size: item.size } }">
        </ng-container>
    </ng-container>

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
export class CardListComponent implements OnDestroy, AfterContentInit {
    @Input() listId: any = Math.random();
    @Input() horizontal = false;
    @Input() cards: Array<Data> | Iterable<Data>;
    @Input() type = ItemTypes.CARD;

    @Output() dropped = new EventEmitter<DropEvent>();

    @ContentChildren(PlaceholderTemplateDirective, { read: TemplateRef })
    placeholderTemplates: QueryList<TemplateRef<PlaceholderTemplateContext>>;
    @ContentChildren(CardTemplateDirective, { read: TemplateRef })
    cardRendererTemplates: QueryList<TemplateRef<CardTemplateContext>>;

    /** @ignore */
    @HostBinding('style.flexDirection')
    get flexDirection() {
        return this.horizontal ? 'row': 'column';
    }

    /** @ignore */
    target = this.dnd.dropTarget<DraggedItem>(null, {
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

    subs = new Subscription();

    constructor(
        private dnd: SkyhookDndService,
        private el: ElementRef<HTMLElement>,
        private service: CardListService,
    ) {
        this.subs.add(
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
            }));

        this.subs.add(this.service.beginDrag$.subscribe((ev: DraggedItem) => {
            this.placeholder$.next({
                index: ev.index,
                size: ev.size,
                over: true
            });
        }));
        this.subs.add(this.service.hover$.subscribe((ev: HoverEvent) => {
            this.hoverOnCard(ev);
        }));
    }

    /** @ignore */
    hoverOnCard(evt: HoverEvent) {
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
    get isEmpty() {
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
        if (this.placeholderTemplates.length !== 1) {
            throw new Error("must have exactly one cardPlaceholder template");
        }
        if (this.cardRendererTemplates.length !== 1) {
            throw new Error("must have exactly one cardRenderer template");
        }
    }

    ngOnChanges(changes: { type?: SimpleChange }) {
        if (changes.type) {
            this.target.setTypes(changes.type.currentValue);
        }
    }

    /** @ignore */
    ngOnDestroy() {
        this.target.unsubscribe();
    }

    /** @ignore */
    tracker(_: number, card: Data) {
        return card.id;
    }
}
