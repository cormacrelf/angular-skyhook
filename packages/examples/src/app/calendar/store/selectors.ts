import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CalendarState } from "./calendar.reducer";
import { Week } from "app/calendar/week";
import { List } from "immutable";

export const calendarFeature = createFeatureSelector<CalendarState>('calendar');

export const startDateSelector = createSelector(
    calendarFeature,
    cal => {
        return cal.startDate;
    }
);

export const isDraggingSelector = createSelector(calendarFeature, cal => !!cal.inFlight || !!cal.original);
export const eventSelector = createSelector(calendarFeature, cal => cal.events);
export const inFlightSelector = createSelector(calendarFeature, cal => cal.inFlight);
export const originalSelector = createSelector(calendarFeature, cal => cal.original);
export const distanceSelector = createSelector(calendarFeature, cal => cal.diff);
export const updatedSelector = createSelector(
    originalSelector,
    distanceSelector,
    (orig, diff) => {
        return orig ? orig.applyDiff(diff) : null;
    }
);

export const weeksSelector = createSelector(
    startDateSelector,
    startDate => {
        let four = List([
            Week.from(startDate.clone()),
            Week.from(startDate.clone().add({ weeks: 1 })),
            Week.from(startDate.clone().add({ weeks: 2 })),
            Week.from(startDate.clone().add({ weeks: 3 })),
        ]);
        const lastDayCovered = four.last().startDate.clone().add({days: 6});
        const lastDayOfMonth = startDate.clone().endOf('month');
        if (lastDayCovered.isBefore(lastDayOfMonth, 'day')) {
            four = four.push(
                Week.from(startDate.clone().add({weeks: 4}))
            );
        }
        return four;
    }
);

export const visibleEvents = createSelector(
    eventSelector,
    weeksSelector,
    (events, weeks) => {
        const firstDay = weeks.first().days[0];
        const lastDay = new Date(weeks.last().days[6].getTime());
        lastDay.setHours(23);
        lastDay.setMinutes(59);
        lastDay.setSeconds(59);
        lastDay.setMilliseconds(999);
        return events.filter(e => {
            return e.end >= firstDay || e.start <= lastDay;
        });
    }
)

export const allEventSelector = createSelector(
    visibleEvents,
    inFlightSelector,
    updatedSelector,
    (events, inFlight, updated) => {
        events = inFlight ? events.push(inFlight) : events;
        events = updated ? events.splice(events.findIndex(e => e.uniqueId === updated.uniqueId), 1, updated) : events;
        return events.sortBy(
            e => e.start,
            (a, b) => a.valueOf() - b.valueOf()
        );
    }
);
