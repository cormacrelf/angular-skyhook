import { Injectable } from "@angular/core";
import { Store, createFeatureSelector, select } from "@ngrx/store";
import { State } from "app/reducers";
import { CalendarState } from "./calendar.reducer";

@Injectable()
export class CalendarService {
    feat = createFeatureSelector<CalendarState>('calendar');
    calendar = this.store.pipe(select(this.feat))
    constructor(private store: Store<State>) {}
}