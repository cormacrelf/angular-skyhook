import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { UtilityModule } from "app/utility.module";
import { SkyhookDndModule } from "angular-skyhook";
import { RouterModule } from "@angular/router";
import { SkyhookMultiBackendModule } from "angular-skyhook-multi-backend";
import { SkyhookCardListModule } from "angular-skyhook-card-list";

import { ListComponent } from "./list.component";
import { MathFormComponent, NameFormComponent } from "./form.component";
import { PrintoutComponent } from './printout.component';
import { ContainerComponent } from "./container.component";

@NgModule({
    declarations: [
        ContainerComponent,
        ListComponent,
        MathFormComponent,
        NameFormComponent,
        PrintoutComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UtilityModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        SkyhookCardListModule,
        RouterModule.forChild([
            { path: "", component: ContainerComponent }
        ])
    ]
})
export class QuizModule { }
