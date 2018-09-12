import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UtilityModule } from "app/utility.module";
import { SkyhookDndModule } from "@angular-skyhook/core";
import { RouterModule } from "@angular/router";
import { SkyhookMultiBackendModule } from "@angular-skyhook/multi-backend";
import { SkyhookSortableModule } from "@angular-skyhook/sortable";
import { StoreModule } from "@ngrx/store";
import { HotkeyModule } from 'angular2-hotkeys';

import { SimpleComponent } from "./simple.component";
import { SummaryComponent } from "./summary.component";
import { ContainerComponent } from "./container.component";
import { reducer } from './store/reducer';

@NgModule({
    declarations: [
        ContainerComponent,
        SimpleComponent,
        SummaryComponent,
    ],
    imports: [
        CommonModule,
        UtilityModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        SkyhookSortableModule,
        StoreModule.forFeature('simple-ngrx', reducer),
        RouterModule.forChild([
            { path: "", component: ContainerComponent }
        ]),
        HotkeyModule,
    ]
})
export class KeyboardModule { }
