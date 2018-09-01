import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SkyhookDndModule } from "@skyhook/core";

import { ContainerComponent } from "./container.component";
import { ItemComponent, DraggableItemComponent } from "./item.component";
import {
    SkyhookMultiBackendModule,
    TouchBackend
} from "@skyhook/multi-backend";
import { UtilityModule } from "../utility.module";

@NgModule({
    declarations: [ContainerComponent, ItemComponent, DraggableItemComponent],
    imports: [
        CommonModule,
        SkyhookDndModule, // .forRoot({ backend: TouchBackend }),
        RouterModule.forChild([{ path: "", component: ContainerComponent }]),
        SkyhookMultiBackendModule,
        UtilityModule
    ]
})
export class Module {}
