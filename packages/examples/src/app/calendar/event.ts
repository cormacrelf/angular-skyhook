import { Record } from 'immutable';
import * as moment from 'moment-mini-ts';
import { getEndOfWeek, daysBetween, getWeekNumber, sameWeek } from './date-utils';

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
    start: new Date(),
    end: new Date(),
    title: "New Event",
}) {
    static standard(title: string, start: Date) {
        const _1pm = new Date(start.getTime());
        _1pm.setHours(13);
        const _2pm = new Date(start.getTime());
        _2pm.setHours(14);
        return new CalendarEvent({
            uniqueId: uniqueId++,
            start: _1pm,
            end: _1pm,
            title,
        });
    }

    static allDay(title: string, start: Date, end: Date) {
        return new CalendarEvent({
            uniqueId: uniqueId++,
            isAllDay: true,
            start: new Date(start.getTime()),
            end: new Date(end.getTime()),
            title
        });
    }

    /** Whether an event spills over to the next week
     * Returns true if it does, and the day who is asking is a monday
     */
    spill(day: Date): boolean {
        return this.isAllDay
            && day.getDay() === 1 // monday
            && day > this.start
            && day <= this.end;
    }

    span(day: Date): number {
        const endOfWeek = getEndOfWeek(day);
        // if the event ends this week, span until the end of the event
        if (this.end < endOfWeek) {
            return daysBetween(day, this.end) + 1;
            // if the event ends some other week, span to the end of the week
        } else {
            return daysBetween(day, endOfWeek) + 1;
        }
    }

    toString() {
        return this.isAllDay
            ? `${this.title} ${this.start.toDateString()} until ${this.end.toDateString()}`
            : `${this.title} ${this.start.toISOString()}`;
    }

    startsThisWeek(day: Date): boolean {
        return sameWeek(day, this.start);
    }
    endsThisWeek(day: Date): boolean {
        return sameWeek(day, this.end);
    }

    applyDiff(diff: Diff) {
        let neu = this;
        if (diff.distance || diff.start) {
            neu = neu.update('start', start => moment(start).add({ days: diff.distance + diff.start }).toDate());
        }
        if (diff.distance || diff.end) {
            neu = neu.update('end', end => moment(end).add({ days: diff.distance + diff.end }).toDate());
        }
        return neu;
    }
}
