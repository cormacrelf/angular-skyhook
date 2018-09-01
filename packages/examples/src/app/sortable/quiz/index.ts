import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { UtilityModule } from "app/utility.module";
import { SkyhookDndModule } from "@skyhook/core";
import { RouterModule } from "@angular/router";
import { SkyhookMultiBackendModule } from "@skyhook/multi-backend";
import { SkyhookSortableModule } from "@skyhook/sortable";

import { ListComponent } from "./list.component";
import { MathFormComponent } from "./math-form.component";
import { PrintoutComponent } from './printout.component';
import { ContainerComponent } from "./container.component";

@NgModule({
    declarations: [
        ContainerComponent,
        ListComponent,
        MathFormComponent,
        PrintoutComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UtilityModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        SkyhookSortableModule,
        RouterModule.forChild([
            { path: "", component: ContainerComponent }
        ])
    ]
})
export class QuizModule { }
