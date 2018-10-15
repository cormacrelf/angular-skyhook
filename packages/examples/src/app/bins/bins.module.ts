import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SkyhookDndModule } from "@angular-skyhook/core";
import { SkyhookMultiBackendModule } from "@angular-skyhook/multi-backend";
import { UtilityModule } from "../utility.module";

import { Bin } from "./bin.component";
import { TrashPile } from "./trash-pile.component";
import { Trash } from "./trash.component";
import { ContainerComponent } from "./container.component";

@NgModule({
    declarations: [Bin, TrashPile, Trash, ContainerComponent],
    imports: [
        CommonModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        RouterModule.forChild([{ path: "", component: ContainerComponent }]),
        UtilityModule
    ]
})
export class BinsModule {}
