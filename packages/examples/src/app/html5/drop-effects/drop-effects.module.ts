import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UtilityModule } from "app/utility.module";
import { SkyhookDndModule } from "@angular-skyhook/core";
import { RouterModule } from "@angular/router";
import { SkyhookMultiBackendModule } from "@angular-skyhook/multi-backend";

import { ContainerComponent } from "./container.component";
import { CopyTargetComponent } from "./copy-target.component";
import { BoxComponent } from "./box.component";

@NgModule({
    declarations: [
        ContainerComponent,
        CopyTargetComponent,
        BoxComponent
    ],
    imports: [
        CommonModule,
        UtilityModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        RouterModule.forChild([{ path: "", component: ContainerComponent }]),
    ],
})
export class DropEffectsModule {
}
