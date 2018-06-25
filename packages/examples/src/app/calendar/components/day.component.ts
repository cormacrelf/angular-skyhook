import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { SkyhookDndService, DragSourceOptions } from "angular-skyhook";
import { ItemTypes } from "../item-types";
import { Moment } from "moment-mini-ts";
import { Store, createSelector } from "@ngrx/store";
import { State } from "app/reducers";
import { NewEvent, HoverNewEvent, BeginDragNewEvent, EndDragNewEvent, DropNewEvent, HoverExistingEvent, DropExistingEvent, HoverResizeStart, HoverResizeEnd } from "../store/calendar.actions";
import { startDateSelector, isDraggingSelector, allEventSelector } from "../store/selectors";
import { Observable, Subject, Subscription } from "rxjs";
import { List } from "immutable";
import { CalendarEvent, Diff } from "app/calendar/event";
import * as faker from 'faker';
import * as Pressure from 'pressure';
import { switchMap, switchMapTo, take } from "rxjs/operators";
import * as moment from 'moment-mini-ts';

@Component({
    selector: 'cal-day',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="day" [class.day--othermonth]="otherMonth$|async" [class.day--weekend]="isWeekend">
        <div class="day-pad day-pad--bg">
        </div>

        <h3 class="day-label">
            <span class="day-label-lozenge" [class.day-label-lozenge--today]="isToday">{{ day.date() }}</span>
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
    @Input() day: Moment;

    get isToday() {
        return this.day.isSame(moment(), 'day');
    }

    get isWeekend() {
        return this.day.isoWeekday() >= 6;
    }

    myEvents = createSelector(allEventSelector, es => {
        // terrible, but works for now
        return es
            .filter(e => {
                return this.day.isSame(e.start, 'day')
                    || e.spill(this.day);
            });
    });
    events$: Observable<List<CalendarEvent>>;

    isDragging$ = this.store.select(isDraggingSelector);

    isOtherMonth = createSelector(
        startDateSelector,
        startDate => {
            return !this.day.isSame(startDate, 'month');
        }
    );

    otherMonth$ = this.store.select(this.isOtherMonth);

    source = this.dnd.dragSource<{ start: Moment }>(ItemTypes.NEW_EVENT, {
        beginDrag: monitor => {
            this.store.dispatch(new BeginDragNewEvent(this.day));
            return { start: this.day.clone() };
        },
        endDrag: monitor => {
            if (!monitor.didDrop()) {
                this.store.dispatch(new EndDragNewEvent());
            }
        }
    });

    target = this.dnd.dropTarget<{ id?: number, start: Moment, end: Moment }>([
        ItemTypes.NEW_EVENT,
        ItemTypes.EXISTING,
        ItemTypes.RESIZE_START,
        ItemTypes.RESIZE_END,
    ], {
        hover: monitor => {
            const { id, start, end } = monitor.getItem();
            const type = monitor.getItemType();
            if (type === ItemTypes.EXISTING) {
                this.store.dispatch(new HoverExistingEvent(id, Diff.distance(this.day.diff(start, 'days'))));
            } else if (type === ItemTypes.RESIZE_START) {
                this.store.dispatch(new HoverResizeStart(id, Diff.resizeStart(this.day.diff(start, 'days'))));
            } else if (type === ItemTypes.RESIZE_END) {
                this.store.dispatch(new HoverResizeEnd(id, Diff.resizeEnd(this.day.diff(end, 'days'))));
            } else if (type === ItemTypes.NEW_EVENT) {
                this.store.dispatch(new HoverNewEvent(this.day));
            }
        },
        drop: monitor => {
            if (monitor.getItemType() === ItemTypes.NEW_EVENT) {
                const { start } = monitor.getItem();
                if (this.day.isAfter(start, 'day')) {
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

    @ViewChild('pad') pad: ElementRef<HTMLDivElement>;

    subs = new Subscription();
    forceStart$ = new Subject<void>();
    forceThreshold$ = new Subject<void>();

    constructor(private dnd: SkyhookDndService, private store: Store<State>) {}

    intradayEvent() {
        this.store.dispatch(new NewEvent(
            CalendarEvent.standard(`Meeting with ${faker.name.findName()}`, this.day.clone().add({hours: 13}))
        ));
    }

    ngOnInit() {
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