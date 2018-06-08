import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from 'angular-skyhook';

import { ContainerComponent } from './container.component';
import { ItemComponent, DraggableItemComponent } from './item.component';
import { MultiBackendPreviewModule, TouchBackend } from '../angular-skyhook-multi-backend';
import { UtilityModule } from '../utility.module';

@NgModule({
    declarations: [
        ContainerComponent,
        ItemComponent,
        DraggableItemComponent,
    ],
    imports: [
        CommonModule,
        SkyhookDndModule,//.forRoot({ backend: TouchBackend }),
        RouterModule.forChild([{ path: '', component: ContainerComponent }]),
        MultiBackendPreviewModule,
        UtilityModule
    ]
})
export class Module { }