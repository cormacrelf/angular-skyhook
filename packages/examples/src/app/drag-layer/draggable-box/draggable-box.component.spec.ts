import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    default as TestBackendImpl,
    TestBackend
} from 'react-dnd-test-backend';
import { SkyhookDndModule, DRAG_DROP_MANAGER } from 'angular-skyhook';

import { DraggableBoxComponent } from './draggable-box.component';
import { BoxComponent } from '../box.component';

describe('DragLayer => DraggableBoxComponent', () => {
    let component: DraggableBoxComponent;
    let fixture: ComponentFixture<DraggableBoxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SkyhookDndModule.forRoot({ backend: TestBackendImpl })],
            declarations: [DraggableBoxComponent, BoxComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DraggableBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
