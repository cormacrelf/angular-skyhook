import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UtilityModule } from "app/utility.module";
import { SkyhookDndModule } from "@angular-skyhook/core";
import { RouterModule } from "@angular/router";
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from "@angular/forms";
import { SkyhookMultiBackendModule } from "@angular-skyhook/multi-backend";
import { SkyhookSortableModule } from "@angular-skyhook/sortable";

import { ContainerComponent } from "./container.component";
import { KanbanBoardComponent } from "./kanban-board/kanban-board.component";
import { KanbanListComponent } from "./kanban-list/kanban-list.component";
import { KanbanCardComponent } from "./kanban-card/kanban-card.component";
import { SortableSpecService } from './specs';

@NgModule({
    declarations: [
        ContainerComponent,
        KanbanBoardComponent,
        KanbanListComponent,
        KanbanCardComponent,
    ],
    imports: [
        CommonModule,
        UtilityModule,
        SkyhookDndModule,
        SkyhookMultiBackendModule,
        SkyhookSortableModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: "", component: ContainerComponent }
        ])
    ],
    providers: [
        SortableSpecService
    ]
})
export class KanbanModule { }
