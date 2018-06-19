import {
    SkyhookDndService,
    DropTargetSpec,
    AddSubscription,
    DropTarget,
    DragSource,
    DragSourceSpec,
    DragLayer
} from 'angular-skyhook';
import { NgModule } from '@angular/core';

@NgModule({
    providers: [SkyhookDndService]
})
export class SkyhookTestingModule {}
