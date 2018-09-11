import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CalendarEvent } from "../event";
import { Moment } from "moment-mini-ts";
import { SkyhookDndService, DragSourceSpec } from "@angular-skyhook/core";
import { Store, createSelector, Action } from "@ngrx/store";
import { State } from "app/reducers";
import { ItemTypes } from "../item-types";
import { BeginDragExistingEvent, EndDragExistingEvent } from "../store/calendar.actions";
import { withLatestFrom, combineAll } from "rxjs/operators";
import { Observable, combineLatest } from "rxjs";

@Component({
    selector: 'cal-event',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss']
})
export class CalendarEventComponent {
    @Input() event: CalendarEvent;
    @Input() draggingNew = false;
    @Input() day: Date;

    // memoize out the span function
    spanSelector = createSelector(
        () => this.event,
        () => this.day,
        (e, day) => {
        return e.span(day);
    });

    get span() {
        return this.spanSelector({});
    }

    source = this.dnd.dragSource(ItemTypes.EXISTING, this.spec('existing'));
    resizeStart = this.dnd.dragSource(ItemTypes.RESIZE_START, this.spec('resize start'));
    resizeEnd = this.dnd.dragSource(ItemTypes.RESIZE_END, this.spec('resize end'));

    draggingEvent$ = combineLatest(
        this.source.listen(m => m.isDragging()),
        this.resizeStart.listen(m => m.isDragging()),
        this.resizeEnd.listen(m => m.isDragging()),
        (a, b, c) => a || b || c
    );

    spec(t: string): DragSourceSpec<{ id: number, start: Date, end: Date }> {
        return {
            isDragging: m => m.getItem().id === this.event.uniqueId,
            beginDrag: m => {
                // apparently trying to do CSS/class modifications during dragstart
                // causes dragend to fire immediately
                // https://bugs.chromium.org/p/chromium/issues/detail?id=168544
                // https://github.com/react-dnd/react-dnd/issues/1085
                // so, just wait until the event handler is synchronously handled
                setTimeout(() => {
                    this.store.dispatch(new BeginDragExistingEvent(this.event.uniqueId));
                }, 0);
                return { id: this.event.uniqueId, start: this.day, end: this.event.end };
            },
            endDrag: monitor => {
                if (!monitor.didDrop()) {
                    this.store.dispatch(new EndDragExistingEvent(this.event.uniqueId));
                }
            }
        };
    }

    constructor(private dnd: SkyhookDndService, private store: Store<State>) {}
}
