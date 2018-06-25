import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store, createSelector } from "@ngrx/store";
import { State } from "app/reducers";
import { NextMonth, PrevMonth } from "app/calendar/store/calendar.actions";
import { calendarFeature, startDateSelector } from "../store/selectors";

const monthSelector = createSelector(
    startDateSelector,
    startDate => {
        return startDate.format('MMMM YYYY');
    }
);

@Component({
    selector: "cal-container",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss']
})
export class CalendarContainerComponent {

    month$ = this.store.select(monthSelector);

    constructor (private store: Store<State>) {}

    prevMonth() {
        this.store.dispatch(new PrevMonth());
    }

    nextMonth() {
        this.store.dispatch(new NextMonth());
    }
}