import { Record } from "immutable";
import * as moment from "moment-mini-ts";
import { Moment } from "moment-mini-ts";

let uniqueId = 1;

export class Week extends Record({
    startDate: moment(),
    uniqueId: 0,
    days: [] as Date[]
}) {

    static from(date: Moment) {
        date = date.startOf('isoWeek');
        return new Week({
            startDate: date,
            uniqueId: uniqueId++,
            days: Week.getDays(date)
        });
    }

    static getDays(startDate: Moment) {
        return [
            startDate.clone().toDate(),
            startDate.clone().add({ days: 1 }).toDate(),
            startDate.clone().add({ days: 2 }).toDate(),
            startDate.clone().add({ days: 3 }).toDate(),
            startDate.clone().add({ days: 4 }).toDate(),
            startDate.clone().add({ days: 5 }).toDate(),
            startDate.clone().add({ days: 6 }).toDate(),
        ];
    }

    includes(day: Moment) {
        // extremely basic implementation
        // doesn't allow configuring timezone or start of week, but good enough
        // Week number according to the ISO-8601 standard, weeks starting on Monday.
        // The first week of the year is the week that contains that year's first
        // Thursday (='First 4-day week').
        return day.isoWeek() === this.startDate.isoWeek();
    }

}