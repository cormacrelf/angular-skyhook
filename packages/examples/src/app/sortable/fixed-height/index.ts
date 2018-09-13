import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UtilityModule } from "app/utility.module";
import { SkyhookDndModule } from "@angular-skyhook/core";
import { RouterModule } from "@angular/router";
import { SkyhookMultiBackendModule } from "@angular-skyhook/multi-backend";
import { SkyhookSortableModule } from "@angular-skyhook/sortable";

import { FixedHeightComponent } from "./fixed-height.component";
import { ContainerComponent } from "./container.component";

@NgModule({
    declarations: [
        ContainerComponent,
        FixedHeightComponent,
    ],
    imports: [
        CommonModule,
        UtilityModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        SkyhookSortableModule,
        RouterModule.forChild([
            { path: "", component: ContainerComponent }
        ])
    ]
})
export class FixedHeightModule { }
