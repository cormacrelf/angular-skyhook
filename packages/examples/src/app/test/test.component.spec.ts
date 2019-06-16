import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestComponent } from './test.component';
import {
    default as createTestBackend,
    TestBackend
} from 'react-dnd-test-backend';
import { SkyhookDndModule, DRAG_DROP_MANAGER } from "@angular-skyhook/core";
import { By } from '@angular/platform-browser';

describe(TestComponent.name, () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let backend: TestBackend;
    let source: any;
    let target: any;

    // Tests whether the dragging class has applied
    const draggingClassApplied = () => {
        return fixture.debugElement.query(By.css('.dragging')) != null;
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SkyhookDndModule.forRoot({ backend: createTestBackend })],
            declarations: [TestComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        const manager = TestBed.get(DRAG_DROP_MANAGER);
        backend = manager.getBackend();
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        source = component.source.getHandlerId();
        target = component.target.getHandlerId();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should drag and then drop', () => {
        backend.simulateBeginDrag([source]);
        fixture.detectChanges();
        expect(draggingClassApplied()).toBeTruthy();

        backend.simulateHover([target]);
        backend.simulateDrop();
        backend.simulateEndDrag();
        expect(component.dropped).toBeTruthy();
        expect(component.endDrag).toBeTruthy();
        fixture.detectChanges();
        expect(draggingClassApplied()).toBeFalsy();
    });

    it('should not react to a plain end drag', () => {
        backend.simulateBeginDrag([source]);
        backend.simulateHover([target]);
        backend.simulateEndDrag();
        expect(component.dropped).toBeFalsy();
        expect(component.endDrag).toBeTruthy();
        fixture.detectChanges();
        expect(draggingClassApplied()).toBeFalsy();
    });
});
