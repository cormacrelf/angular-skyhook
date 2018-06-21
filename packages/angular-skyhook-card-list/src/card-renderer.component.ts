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
    ViewChild
} from '@angular/core';
import {
    SkyhookDndService,
    Offset,
    DropTargetMonitor,
    DragSourceMonitor
} from 'angular-skyhook';
import { ItemTypes } from './item-types';
import { HoverEvent, BeginEvent } from './hover-event';
import { DraggedItem } from './dragged-item';
import {
    CardRendererDirective,
    CardRendererContext
} from './card-renderer.directive';
import { Data } from './data';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Size } from './size';
import { Observable } from 'rxjs';

// TODO: render target box at full width (vertical) or full height (horiz)

@Component({
    selector: 'skyhook-card-renderer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div #sizingDiv
         [dropTarget]="target" [dropTargetType]="type"
         *ngLet="isDragging$|async as isDragging">
        <ng-container *ngTemplateOutlet="template; context: {$implicit: card, isDragging: isDragging, source: source }">
        </ng-container>
    </div>
    `
})
export class CardRendererComponent implements OnInit, OnDestroy {
    @Input() card: Data;
    @Input() index: number;
    @Input() listId: any;
    @Input() template: TemplateRef<CardRendererContext>;
    @Input() horizontal = false;
    @Input() type = ItemTypes.CARD;

    private rand = Math.random();

    @Output() begin = new EventEmitter<BeginEvent>();
    @Output() hover = new EventEmitter<HoverEvent>();

    private isDragging = false;
    @HostBinding('style.display')
    get hostDisplay() {
        return this.isDragging ? 'none' : null;
    }
    @ViewChild('sizingDiv') sizingDiv: ElementRef;

    private target = this.dnd.dropTarget<DraggedItem>(null, {
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
            this.hover.emit({
                mouse: this.horizontal
                    ? monitor.getClientOffset().x
                    : monitor.getClientOffset().y,
                hover: {
                    start: this.top(),
                    size: this.size(),
                    listId: this.listId,
                    index: this.index,
                    x: this.rect().left,
                    y: this.rect().top
                },
                source: sourceItem
            });
        }
    });

    private source = this.dnd.dragSource<DraggedItem>(null, {
        // isDragging: monitor => this.isDragging,
        beginDrag: monitor => {
            // this.isDragging = true;
            // this.cdr.markForCheck();
            const size = this.size();
            this.begin.emit({
                id: this.card.id,
                index: this.index,
                size
            });
            return {
                id: this.card.id,
                data: this.card,
                index: this.index,
                size,
                listId: this.listId
            };
        }
    });

    isDragging$ = this.source.listen(m => m.isDragging());

    constructor(
        private dnd: SkyhookDndService,
        private cdr: ChangeDetectorRef
    ) {}

    private rect() {
        const rect = (this.sizingDiv
            .nativeElement as Element).getBoundingClientRect();
        return rect;
    }

    private size() {
        return new Size(this.width(), this.height());
    }

    private width() {
        const rect = this.rect();
        return rect.width || rect.right - rect.left;
    }

    private height() {
        const rect = this.rect();
        return rect.height || rect.bottom - rect.top;
    }

    private top() {
        return this.horizontal ? this.rect().left : this.rect().top;
    }

    private mouse(monitor: DropTargetMonitor) {
        const offset = monitor.getClientOffset();
        return this.horizontal ? offset.x : offset.y;
    }

    ngOnInit() {
        this.isDragging$.subscribe(d => {
            this.isDragging = d;
            this.cdr.markForCheck();
        });
    }

    ngOnChanges() {
        this.source.setType(this.type);
    }

    ngOnDestroy() {
        this.source.unsubscribe();
        this.target.unsubscribe();
    }
}
