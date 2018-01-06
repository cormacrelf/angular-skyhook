import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from 'angular-skyhook';

import { ContainerComponent } from './container.component';
import { ItemComponent, DraggableItemComponent } from './item.component';
import { MultiBackendPreviewModule } from '../angular-skyhook-multi-backend';

@NgModule({
    declarations: [
        ContainerComponent,
        ItemComponent,
        DraggableItemComponent,
    ],
    imports: [
        CommonModule,
        SkyhookDndModule,
        RouterModule.forChild([{ path: '', component: ContainerComponent }]),
        MultiBackendPreviewModule
    ]
})
export class Module { }