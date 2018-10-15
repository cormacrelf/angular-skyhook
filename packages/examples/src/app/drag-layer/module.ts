import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from "@angular-skyhook/core";
import { CustomDragLayerComponent } from './custom-drag-layer/custom-drag-layer.component';
import { DraggableBoxComponent } from './draggable-box/draggable-box.component';
import { DragContainerComponent } from './drag-container/drag-container.component';
import { BoxDragPreviewComponent } from './box-drag-preview/box-drag-preview.component';
import { ContainerComponent } from './container.component';
import { BoxComponent } from './box.component';
import { UtilityModule } from '../utility.module';

@NgModule({
    declarations: [
        ContainerComponent,
        CustomDragLayerComponent,
        DraggableBoxComponent,
        DragContainerComponent,
        BoxDragPreviewComponent,
        BoxComponent
    ],
    imports: [
        CommonModule,
        SkyhookDndModule,
        RouterModule.forChild([{ path: '', component: ContainerComponent }]),
        UtilityModule
    ],
})
export class DragLayerModule { }
