import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UtilityModule } from "../utility.module";
import { SkyhookDndModule } from "angular-skyhook";
import { RouterModule } from "@angular/router";
import { SkyhookMultiBackendModule } from "angular-skyhook-multi-backend";

import { KanbanContainerComponent } from "./container.component";
import { KanbanCardComponent } from "./card.component";
import { SkyhookCardListModule } from "angular-skyhook-card-list";
import { ReactiveFormsModule } from "@angular/forms";
import { AddCardComponent } from "./add-card.component";

@NgModule({
    declarations: [
        KanbanContainerComponent,
        KanbanCardComponent,
        AddCardComponent
    ],
    imports: [
        CommonModule,
        UtilityModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        SkyhookCardListModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: "", component: KanbanContainerComponent }
        ])
    ]
})
export class KanbanModule {}
