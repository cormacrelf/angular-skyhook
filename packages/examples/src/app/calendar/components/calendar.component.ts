import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store, select, createSelector } from "@ngrx/store";
import { CalendarState } from "app/calendar/store/calendar.reducer";
import { weeksSelector } from "../store/selectors";
import { Week } from "app/calendar/week";
import { Moment } from "moment-mini-ts";
import { ResetCalendar } from "../store/calendar.actions";

@Component({
    selector: 'cal-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    weeks$ = this.store.pipe(select(weeksSelector));

    constructor (private store: Store<CalendarState>) {}

    trackWeek(_, week: Week) {
        return week.uniqueId;
    }
    trackDay(i: number, day: Moment) {
        return i;
    }
    ngOnInit() {
        this.store.dispatch(new ResetCalendar());
    }
}
