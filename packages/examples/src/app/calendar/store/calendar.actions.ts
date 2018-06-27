import { Action } from '@ngrx/store';
import { CalendarEvent, Diff } from '../event';

export enum CalendarActionTypes {
  NewEvent = '[Calendar] CREATE_EVENT',
  BeginDragNewEvent = '[Calendar] BEGIN_DRAG_NEW_EVENT',
  EndDragNewEvent = '[Calendar] END_DRAG_NEW_EVENT',
  HoverNewEvent = '[Calendar] HOVER_NEW_EVENT',
  DropNewEvent = '[Calendar] DROP_NEW_EVENT',
  ResetCalendar = '[Calendar] RESET',
  NextMonth = '[Calendar] Next Month',
  PrevMonth = '[Calendar] Previous Month',

  BeginDragExistingEvent = '[Calendar] BEGIN_DRAG_EXISTING_EVENT',
  EndDragExistingEvent = '[Calendar] END_DRAG_EXISTING_EVENT',
  DropExistingEvent = '[Calendar] DROP_EXISTING_EVENT',

  HoverExistingEvent = '[Calendar] HOVER_EXISTING_EVENT',
  HoverResizeStart = '[Calendar] HOVER_RESIZE_START',
  HoverResizeEnd = '[Calendar] HOVER_RESIZE_END',
}

export class NewEvent implements Action {
  readonly type = CalendarActionTypes.NewEvent;
  constructor (public event: CalendarEvent) {}
}

export class BeginDragNewEvent implements Action {
  readonly type = CalendarActionTypes.BeginDragNewEvent;
  constructor (public start: Date) {}
}

export class EndDragNewEvent implements Action {
  readonly type = CalendarActionTypes.EndDragNewEvent;
}

export class HoverNewEvent implements Action {
  readonly type = CalendarActionTypes.HoverNewEvent;
  constructor (public end: Date) {}
}

export class DropNewEvent implements Action {
  readonly type = CalendarActionTypes.DropNewEvent;
  constructor (public start: Date, public end: Date, public title = "New Event") {}
}

export class ResetCalendar implements Action {
  readonly type = CalendarActionTypes.ResetCalendar;
}

export class NextMonth implements Action {
  readonly type = CalendarActionTypes.NextMonth;
}

export class PrevMonth implements Action {
  readonly type = CalendarActionTypes.PrevMonth;
}

export class BeginDragExistingEvent implements Action {
  readonly type = CalendarActionTypes.BeginDragExistingEvent;
  constructor (public id: number) {}
}

export class EndDragExistingEvent implements Action {
  readonly type = CalendarActionTypes.EndDragExistingEvent;
  constructor (public id: number) {}
}

export class HoverExistingEvent implements Action {
  readonly type = CalendarActionTypes.HoverExistingEvent;
  constructor (public id: number, public diff: number) {}
}
export class HoverResizeStart implements Action {
  readonly type = CalendarActionTypes.HoverResizeStart;
  constructor (public id: number, public diff: number) {}
}
export class HoverResizeEnd implements Action {
  readonly type = CalendarActionTypes.HoverResizeEnd;
  constructor (public id: number, public diff: number) {}
}

export class DropExistingEvent implements Action {
  readonly type = CalendarActionTypes.DropExistingEvent;
  constructor (public id: number) {}
}

export type CalendarActions
  = NewEvent
  | BeginDragNewEvent
  | HoverNewEvent
  | EndDragNewEvent
  | DropNewEvent
  | ResetCalendar
  | NextMonth
  | PrevMonth
  | BeginDragExistingEvent
  | HoverExistingEvent
  | HoverResizeStart
  | HoverResizeEnd
  | EndDragExistingEvent
  | DropExistingEvent
  ;
