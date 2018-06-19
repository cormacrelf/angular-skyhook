import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    default as TestBackendImpl,
    TestBackend
} from 'react-dnd-test-backend';
import { SkyhookDndModule, DRAG_DROP_MANAGER } from 'angular-skyhook';

import { CustomDragLayerComponent } from './custom-drag-layer.component';
import { BoxDragPreviewComponent } from '../box-drag-preview/box-drag-preview.component';
import { BoxComponent } from '../box.component';

describe('DragLayer => CustomDragLayerComponent', () => {
    let component: CustomDragLayerComponent;
    let fixture: ComponentFixture<CustomDragLayerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SkyhookDndModule.forRoot({ backend: TestBackendImpl })],
            declarations: [
                CustomDragLayerComponent,
                BoxDragPreviewComponent,
                BoxComponent
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
