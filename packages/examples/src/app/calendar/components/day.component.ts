import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { SkyhookDndService, DragSourceOptions } from "@angular-skyhook/core";
import { ItemTypes } from "../item-types";
import { Store, createSelector } from "@ngrx/store";
import { State } from "app/reducers";
import { NewEvent, HoverNewEvent, BeginDragNewEvent, EndDragNewEvent, DropNewEvent, HoverExistingEvent, DropExistingEvent, HoverResizeStart, HoverResizeEnd } from "../store/calendar.actions";
import { startDateSelector, isDraggingSelector, allEventSelector } from "../store/selectors";
import { Observable, Subject, Subscription } from "rxjs";
import { List } from "immutable";
import { CalendarEvent, Diff } from "app/calendar/event";
import * as faker from 'faker';
import * as Pressure from 'pressure';
import { switchMap, take } from "rxjs/operators";
import { daysBetween } from "../date-utils";

@Component({
    selector: 'cal-day',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="day" [class.day--othermonth]="otherMonth$|async" [class.day--weekend]="isWeekend">
        <div class="day-pad day-pad--bg">
        </div>

        <h3 class="day-label">
            <span class="day-label-lozenge" [class.day-label-lozenge--today]="isToday">{{ day.getDate() }}</span>
        </h3>

        <cal-event *ngFor="let e of events$|async; trackBy: unique" [event]="e" [draggingNew]="isDragging$|async" [day]="day">
        </cal-event>

        <div #pad class="day-pad"
             (dblclick)="intradayEvent()"
             [dragSource]="source"
             [noHTML5Preview]="true"
             [dropTarget]="target"
             [class.day-pad--front]="(isDragging$|async)">
        </div>

    </div>
    `,
    styles: [`
    :host, .day {
        display: contents;
    }
    `]
})
export class CalendarDayComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() day: Date;

    today: Date;

    get isToday() {
        return this.day.valueOf() === this.today.valueOf();
    }

    get isWeekend() {
        const day = this.day.getDay();
        return day === 6 || day === 0;
    }

    myEvents = createSelector(allEventSelector, (es) => {
        return es
            .filter(e => {
                const startOfAllday = e.isAllDay && e.start.valueOf() === this.day.valueOf();
                const diff = daysBetween(e.start, this.day);
                const sameAsIntraday = !e.isAllDay && diff === 0;
                const spilled = e.spill(this.day);
                return startOfAllday || sameAsIntraday || spilled;
            });
    });
    events$: Observable<List<CalendarEvent>>;

    isDragging$ = this.store.select(isDraggingSelector);

    isOtherMonth = createSelector(
        startDateSelector,
        startDate => {
            return this.day.getMonth() !== startDate.month();
        }
    );

    otherMonth$ = this.store.select(this.isOtherMonth);

    source = this.dnd.dragSource<{ start: Date }>(ItemTypes.NEW_EVENT, {
        beginDrag: monitor => {
            this.store.dispatch(new BeginDragNewEvent(this.day));
            return { start: this.day };
        },
        endDrag: monitor => {
            if (!monitor.didDrop()) {
                this.store.dispatch(new EndDragNewEvent());
            }
        }
    });

    target = this.dnd.dropTarget<{ id?: number, start: Date, end: Date }>([
            ItemTypes.NEW_EVENT,
            ItemTypes.EXISTING,
            ItemTypes.RESIZE_START,
            ItemTypes.RESIZE_END,
    ], {
        hover: monitor => {
            const { id, start, end } = monitor.getItem();
            const type = monitor.getItemType();
            switch (type) {
                case ItemTypes.EXISTING: {
                    return this.store.dispatch(new HoverExistingEvent(id, daysBetween(start, this.day)));
                }
                case ItemTypes.RESIZE_START: {
                    return this.store.dispatch(new HoverResizeStart(id, daysBetween(start, this.day)));
                }
                case ItemTypes.RESIZE_END: {
                    return this.store.dispatch(new HoverResizeEnd(id, daysBetween(end, this.day)));
                }
                case ItemTypes.NEW_EVENT: {
                    return this.store.dispatch(new HoverNewEvent(this.day));
                }
            }
        },
        drop: monitor => {
            if (monitor.getItemType() === ItemTypes.NEW_EVENT) {
                const { start } = monitor.getItem();
                if (this.day > start) {
                    this.store.dispatch(new DropNewEvent(start, this.day));
                } else {
                    this.store.dispatch(new EndDragNewEvent());
                }
            } else {
                const { id } = monitor.getItem();
                this.store.dispatch(new DropExistingEvent(id));
            }
        }
    });

    @ViewChild('pad', { static: false }) pad: ElementRef<HTMLDivElement>;

    subs = new Subscription();
    forceStart$ = new Subject<void>();
    forceThreshold$ = new Subject<void>();

    constructor(private dnd: SkyhookDndService, private store: Store<State>) {}

    intradayEvent() {
        this.store.dispatch(new NewEvent(
            CalendarEvent.standard(`Meeting with ${faker.name.findName()}`, this.day)
        ));
    }

    ngOnInit() {
        this.today = new Date();
        this.today.setHours(0);
        this.today.setMinutes(0);
        this.today.setSeconds(0);
        this.today.setMilliseconds(0);

        this.events$ = this.store.select(this.myEvents);
        this.subs.add(this.source);
        this.subs.add(this.target);

        // listen to forceStart$, but when you hear one, listen for ONE threshold crossing instead
        // if you hear another forceStart, switch to a new threshold listener
        // overall effect = 'force click' that happens only once (take(1)) per touch,
        // without activating >1x as you cross the threshold over and over.
        this.subs.add(this.forceStart$.pipe(
            // switch to a new take(1) each time
            switchMap(start => this.forceThreshold$.pipe(take(1)))
        ).subscribe(() => {
            this.intradayEvent();
        }));
    }

    ngAfterViewInit() {
        Pressure.set(this.pad.nativeElement, {
            start: () => this.forceStart$.next(),
            startDeepPress: () => this.forceThreshold$.next()
        }, {
            polyfill: false,
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    unique(_, e: CalendarEvent) {
        return e.uniqueId;
    }

}
