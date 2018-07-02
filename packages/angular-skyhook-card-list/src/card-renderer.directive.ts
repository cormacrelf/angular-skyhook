import {
    Directive,
    Component,
    Output,
    EventEmitter,
    Input,
    ContentChild,
    TemplateRef,
    ElementRef,
    ChangeDetectionStrategy,
    OnInit,
    OnDestroy,
    HostBinding,
    ChangeDetectorRef,
    ViewChild,
    SimpleChange
} from "@angular/core";
import {
    SkyhookDndService,
    Offset,
    DropTargetMonitor,
    DragSourceMonitor,
    DropTargetDirective
} from "angular-skyhook";
import { ItemTypes } from "./item-types";
import { HoverEvent, BeginEvent } from "./hover-event";
import { DraggedItem } from "./dragged-item";
import { Data } from "./data";
import { tap } from "rxjs/operators";
import { BehaviorSubject, Subscription } from "rxjs";
import { Size } from "./size";
import { Observable } from "rxjs";
import { DropTarget, DragSource } from 'angular-skyhook';

import { CardRendererInput } from "./card-template.directive";
import { CardListService } from "./service";

// TODO: render target box at full width (vertical) or full height (horiz)

@Directive({
    selector: '[cardRenderer]',
    exportAs: 'cardRenderer'

    // changeDetection: ChangeDetectionStrategy.OnPush,
    // selector: "skyhook-card-renderer",
    // template: `
    // <ng-container *ngLet="isDragging$|async as isDragging">
    //     <ng-container *ngTemplateOutlet="template; context: { $implicit: card, isDragging: isDragging, source: source }">
    //     </ng-container>
    // </ng-container>
    // `,
    // styles: [`
    //     #<{(| So you can get the client rect with a nonzero height |)}>#
    //     :host { display: block; }
    // `]
})
export class CardRendererDirective implements OnInit, OnDestroy {
    @Input('cardRenderer') context: CardRendererInput;

    get card() { return this.context.card; }
    get type() { return this.context.type; }
    get listId() { return this.context.listId; }
    get index() { return this.context.index; }
    get horizontal() { return this.context.horizontal; }
    @HostBinding("style.order")
    get order() { return this.context.order; }

    /** @ignore */
    isDragging = false;
    @HostBinding("style.display")
    get hostDisplay() {
        return this.isDragging ? "none" : null;
    }

    /** @ignore */
    target = this.dnd.dropTarget<DraggedItem>(null, {
        // this is a hover-only situation
        canDrop: monitor => false,
        hover: monitor => {
            if (!monitor.isOver()) {
                return;
            }
            if (this.isDragging) {
                return;
            }
            const sourceItem = monitor.getItem();
            this.service.hover$.next({
                mouse: this.horizontal
                    ? monitor.getClientOffset().x
                    : monitor.getClientOffset().y,
                hover: {
                    start: this.top(),
                    size: this.size(),
                    listId: this.listId,
                    index: this.index
                },
                source: sourceItem
            });
        }
    });

    /** @ignore */
    source = this.dnd.dragSource<DraggedItem>(null, {
        // isDragging: monitor => this.isDragging,
        beginDrag: monitor => {
            // this.isDragging = true;
            // this.cdr.markForCheck();
            const size = this.size();
            let ev: DraggedItem = {
                id: this.card.id,
                data: this.card,
                index: this.index,
                size,
                listId: this.listId
            };
            this.service.beginDrag$.next(ev);
            return ev;
        }
    });

    isDragging$ = this.source.listen(m => m.isDragging());

    subs = new Subscription();

    constructor(
        private dnd: SkyhookDndService,
        private cdr: ChangeDetectorRef,
        private el: ElementRef<HTMLElement>,
        private service: CardListService,
    ) { }

    /** @ignore */
    rect() {
        if (!this.el) {
            throw new Error("cardRenderer expected to be attached to a real DOM element");
        }
        const rect = (this.el.nativeElement as Element).getBoundingClientRect();
        return rect;
    }

    /** @ignore */
    size() {
        return new Size(this.width(), this.height());
    }

    /** @ignore */
    width() {
        const rect = this.rect();
        return rect.width || rect.right - rect.left;
    }

    /** @ignore */
    height() {
        const rect = this.rect();
        return rect.height || rect.bottom - rect.top;
    }

    /** @ignore */
    top() {
        return this.horizontal ? this.rect().left : this.rect().top;
    }

    /** @ignore */
    mouse(monitor: DropTargetMonitor) {
        const offset = monitor.getClientOffset();
        return this.horizontal ? offset.x : offset.y;
    }

    ngOnInit() {
        this.subs.add(
            this.isDragging$.subscribe(d => {
                this.isDragging = d;
                this.cdr.markForCheck();
            })
        );
        this.target.setTypes(this.type);
        this.source.setType(this.type);
    }

    ngAfterViewInit() {
        if (this.el) {
            this.target.connectDropTarget(this.el.nativeElement);
        }
    }

    ngOnChanges(changes: { type?: SimpleChange }) {
        // if (changes.type) {
            this.target.setTypes(this.type);
            this.source.setType(this.type);
        // }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
        this.source.unsubscribe();
        this.target.unsubscribe();
    }
}
