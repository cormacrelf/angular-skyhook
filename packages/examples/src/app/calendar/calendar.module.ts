import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UtilityModule } from "../utility.module";
import { SkyhookDndModule } from "@angular-skyhook/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SkyhookMultiBackendModule } from "@angular-skyhook/multi-backend";
import { StoreModule } from '@ngrx/store';
import { CalendarService } from "./store/service";
import * as fromCalendar from './store/calendar.reducer';

import { CalendarContainerComponent } from "./components/container.component";
import { CalendarComponent } from "./components/calendar.component";
import { CalendarDayComponent } from "./components/day.component";
import { CalendarEventComponent } from "./components/event.component";

@NgModule({
    declarations: [
        CalendarContainerComponent,
        CalendarComponent,
        CalendarDayComponent,
        CalendarEventComponent,
    ],
    imports: [
        CommonModule,
        UtilityModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        ReactiveFormsModule,
        StoreModule,
        RouterModule.forChild([
            { path: "", component: CalendarContainerComponent }
        ]),
        StoreModule.forFeature('calendar', fromCalendar.reducer),
    ],
    providers: [ CalendarService ]
})
export class CalendarModule { }
