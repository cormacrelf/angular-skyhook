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
    <ng-container *ngLet="cardOver$|async as cardOver">

    <div [dropTarget]="target" [dropTargetType]="type" [class]="containerClass"
         [ngStyle]="{ display: 'flex', flexDirection: horizontal ? 'row' : 'column' }">

        <skyhook-card-renderer
            *ngFor="let card of cards; let i = index; trackBy: tracker"
            [index]="i"
            [card]="card"
            [type]="type"
            [listId]="listId"
            [horizontal]="horizontal"
            (hover)="onHover($event)"
            (begin)="begin($event)"
            [template]="cardRendererTemplates.first"
            [ngStyle]="{ order: i >= phi ? i + 1 : i }"
            >
        </skyhook-card-renderer>

        <ng-container *ngIf="cardOver">
            <div *ngLet="item$|async as item" [ngStyle]="{ order: phi }">
                <ng-container *ngTemplateOutlet="placeholderTemplates.first; context: { $implicit: item }">
                </ng-container>
            </div>
        </ng-container>

    </div>

    </ng-container>
    </ng-container>
    `
})
export class CardListComponent implements OnDestroy, AfterContentInit {
    @Input() listId: any = Math.random();
    @Input() horizontal = false;

    @Input() cards: Data[];
    @Output() dropped = new EventEmitter<DropEvent>();

    @Input() type = ItemTypes.CARD;
    @Input() containerClass = "";

    @ContentChildren(CardPlaceholderDirective, { read: TemplateRef })
    placeholderTemplates: QueryList<TemplateRef<CardPlaceholderContext>>;
    @ContentChildren(CardRendererDirective, { read: TemplateRef })
    cardRendererTemplates: QueryList<TemplateRef<CardRendererContext>>;

    private target = this.dnd.dropTarget(null, {
        drop: monitor => {
            const drag = monitor.getItem() as DraggedItem;
            this.dropEmit$.next(drag);
            this.placeholder$.next({ index: 0, size: { width: 0, height: 0 } });
        }
    });

    cardOver$ = this.target.listen(m => m.isOver({ shallow: false }));
    item$ = this.target.listen(m => m.getItem());

    dropEmit$ = new Subject<DraggedItem>();
    placeholder$ = new BehaviorSubject({
        index: 0,
        size: { width: 0, height: 0 }
    });
    placeholderIndex$: Observable<number> = this.placeholder$.pipe(
        map(p => p.index),
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

    private begin({ id, index, size }: BeginEvent) {
        this.placeholder$.next({ index, size });
    }

    private onHover(evt: HoverEvent) {
        let dim = this.horizontal
            ? evt.hover.size.width
            : evt.hover.size.height;
        const targetCentre = evt.hover.start + dim / 2.0;
        this.placeholder$.next({
            index:
                evt.mouse < targetCentre
                    ? evt.hover.index
                    : evt.hover.index + 1,
            size: evt.source.size
        });
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
