import { CalendarActions, CalendarActionTypes } from './calendar.actions';
import { List, Record } from 'immutable';
import { CalendarEvent, Diff } from 'app/calendar/event';
import * as moment from 'moment-mini-ts';
import * as faker from 'faker';

export interface CalendarState {
  events: List<CalendarEvent>;
  startDate: moment.Moment,
  inFlight: CalendarEvent | null;
  original: CalendarEvent | null;
  diff: Diff;
}

const dayOne = moment().startOf('month');

export const CalendarStateRecord = Record({
  events: List([
    CalendarEvent.standard(`Meeting with ${faker.name.findName()}`, dayOne.clone().add({ days: 3, hours: 13 }).toDate()),
    CalendarEvent.allDay("Conference in Berlin", dayOne.clone().add({ days: 7 }).toDate(), dayOne.clone().add({ days: 11 }).toDate()),
  ]),
  startDate: dayOne,
  inFlight: null as CalendarEvent,
  original: null as CalendarEvent,
  diff: new Diff()
});

export function reducer(state = new CalendarStateRecord(), action: CalendarActions): CalendarState {
  // console.log(action);
  switch (action.type) {

    case CalendarActionTypes.NewEvent: {
      return state.update('events', es => es.push(action.event));
    }

    case CalendarActionTypes.BeginDragNewEvent: {
      return state.set('inFlight',
        CalendarEvent.allDay(`Conference in ${faker.address.city()}`, action.start, action.start)
        .set('temp', true));
    }

    case CalendarActionTypes.HoverNewEvent: {
      // if (state.inFlight && state.inFlight.end === action.end) { return state; }
      return state.update('inFlight', f => f.set('end', action.end));
    }

    case CalendarActionTypes.EndDragNewEvent: {
      return state.set('inFlight', null);
    }

    case CalendarActionTypes.ResetCalendar: {
      return new CalendarStateRecord();
    }

    case CalendarActionTypes.DropNewEvent: {
      if (state.inFlight) {
        const inFlight = state.inFlight
          .set('end', action.end)
          .set('temp', false);
        state = state.update('events', evs => evs.push(inFlight));
      }
      state = state.set('inFlight', null);
      return state;
    }

    case CalendarActionTypes.PrevMonth: {
      return state.set('startDate', state.startDate.clone().add({months: -1}).startOf('month'));
    }
    case CalendarActionTypes.NextMonth: {
      return state.set('startDate', state.startDate.clone().add({months: 1}).startOf('month'));
    }

    case CalendarActionTypes.BeginDragExistingEvent: {
      return state
        .set('original', state.events.find(e => e.uniqueId === action.id));
    }

    case CalendarActionTypes.EndDragExistingEvent: {
      return state.set('original', null).set('diff', new Diff());
    }

    case CalendarActionTypes.HoverResizeStart: {
      return state.update('diff', d => d.set('start', action.diff));
    }
    case CalendarActionTypes.HoverResizeEnd: {
      return state.update('diff', d => d.set('end', action.diff));
    }
    case CalendarActionTypes.HoverExistingEvent: {
      return state.update('diff', d => d.set('distance', action.diff));
    }

    case CalendarActionTypes.DropExistingEvent: {
      if (!state.original) {
        return state;
      }
      return state.update('events', es => {
        const idx = es.findIndex(e => e.uniqueId === action.id);
        return es.update(idx, e => e.applyDiff(state.diff));
      }).set('original', null).set('diff', new Diff());
    }

    default:
      return state;
  }
}
