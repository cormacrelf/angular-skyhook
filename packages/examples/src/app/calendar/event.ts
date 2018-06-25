import { Record } from 'immutable';
import * as moment from 'moment-mini-ts';
import { Moment } from 'moment-mini-ts';

let uniqueId = 0;

export class Diff extends Record({
  start: 0,
  distance: 0,
  end: 0,
}) {
    static distance(d: number) {
        return new Diff({ distance: d });
    }
    static resizeStart(d: number) {
        return new Diff({ start: d });
    }
    static resizeEnd(d: number) {
        return new Diff({ end: d });
    }
}

export class CalendarEvent extends Record({
    uniqueId: 0,
    temp: false,
    isAllDay: false,
    start: moment(),
    end: moment().add({ hours: 1 }),
    title: "New Event",
}) {
    static standard(title: string, start: Moment) {
        return new CalendarEvent({
            uniqueId: uniqueId++,
            start,
            title,
            end: start.clone().add({ hours: 1 }),
        });
    }

    static allDay(title: string, start: Moment, end: Moment) {
        return new CalendarEvent({
            uniqueId: uniqueId++,
            isAllDay: true,
            start: start.clone().startOf('day'),
            end: end.clone().startOf('day'),
            title
        });
    }

    /** Whether an event spills over to the next week
     * Returns true if it does, and the day who is asking is a monday
     */
    spill(day: Moment): boolean {
        return day.isoWeekday() === 1 // monday
            && day.isAfter(this.start)
            && day.isSameOrBefore(this.end);
    }

    span(day: Moment): number {
        const endOfWeek = day.clone().endOf('isoWeek');
        // if the event ends this week, span until the end of the event
        if (this.end.isSameOrBefore(endOfWeek, 'day')) {
            return this.end.diff(day, 'days') + 1;
            // if the event ends some other week, span to the end of the week
        } else {
            return endOfWeek.diff(day, 'days') + 1;
        }
    }

    toString() {
        const fmt = 'YYYY-MM-DD';
        return this.isAllDay
            ? `${this.title} ${this.start.format(fmt)} until ${this.end.format(fmt)}`
            : `${this.title} ${this.start.format()}`;
    }

    startsThisWeek(day: Moment): boolean {
        return day.isSame(this.start, 'isoWeek');
    }
    endsThisWeek(day: Moment): boolean {
        return day.isSame(this.end, 'isoWeek');
    }

    applyDiff(diff: Diff) {
        let neu = this;
        if (diff.distance || diff.start) {
            neu = neu.update('start', start => start.clone().add({ days: diff.distance + diff.start }));
        }
        if (diff.distance || diff.end) {
            neu = neu.update('end', end => end.clone().add({ days: diff.distance + diff.end }));
        }
        return neu;
    }
}
