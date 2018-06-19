import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragContainerComponent } from './drag-container.component';
import {
    default as TestBackendImpl,
    TestBackend
} from 'react-dnd-test-backend';
import { SkyhookDndModule, DRAG_DROP_MANAGER } from 'angular-skyhook';
import { DraggableBoxComponent } from '../draggable-box/draggable-box.component';
import { CustomDragLayerComponent } from '../custom-drag-layer/custom-drag-layer.component';
import { SpotComponent } from '../spot.component';
import { CrosshairsComponent } from '../crosshairs.component';
import { BoxDragPreviewComponent } from '../box-drag-preview/box-drag-preview.component';

describe('XY => DragContainerComponent', () => {
    let component: DragContainerComponent;
    let fixture: ComponentFixture<DragContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SkyhookDndModule.forRoot({ backend: TestBackendImpl })],
            declarations: [
                DragContainerComponent,
                DraggableBoxComponent,
                CustomDragLayerComponent,
                SpotComponent,
                CrosshairsComponent,
                BoxDragPreviewComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DragContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
