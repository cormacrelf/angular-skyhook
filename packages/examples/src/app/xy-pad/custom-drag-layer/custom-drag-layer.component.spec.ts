import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    default as TestBackendImpl,
    TestBackend
} from 'react-dnd-test-backend';
import { SkyhookDndModule, DRAG_DROP_MANAGER } from 'angular-skyhook';

import { CustomDragLayerComponent } from './custom-drag-layer.component';
import { BoxDragPreviewComponent } from '../box-drag-preview/box-drag-preview.component';
import { CrosshairsComponent } from '../crosshairs.component';
import { SpotComponent } from '../spot.component';

describe('XY => CustomDragLayerComponent', () => {
    let component: CustomDragLayerComponent;
    let fixture: ComponentFixture<CustomDragLayerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SkyhookDndModule.forRoot({ backend: TestBackendImpl })],
            declarations: [
                CustomDragLayerComponent,
                BoxDragPreviewComponent,
                CrosshairsComponent,
                SpotComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomDragLayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
