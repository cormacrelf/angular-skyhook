import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import {
    default as TestBackendImpl,
    TestBackend
} from 'react-dnd-test-backend';
import { SkyhookDndModule, DRAG_DROP_MANAGER } from 'angular-skyhook';

import { DraggableBoxComponent } from './draggable-box.component';
import { SpotComponent } from '../spot.component';
import { CrosshairsComponent } from '../crosshairs.component';

describe('XY => DraggableBoxComponent', () => {
    let component: DraggableBoxComponent;
    let fixture: ComponentFixture<DraggableBoxComponent>;
    let backend: TestBackend;
    let source;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SkyhookDndModule.forRoot({ backend: TestBackendImpl })],
            declarations: [
                DraggableBoxComponent,
                SpotComponent,
                CrosshairsComponent
            ]
        }).compileComponents();
    }));

    const init = (id: number) => {
        const fx = TestBed.createComponent(DraggableBoxComponent);
        fx.componentInstance.spot = { id, x: 0, y: 0 };
        fx.detectChanges();
        return fx;
    };

    beforeEach(() => {
        backend = TestBed.get(DRAG_DROP_MANAGER).getBackend();
        fixture = init(1);
        component = fixture.componentInstance;
        source = component.source.getHandlerId();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(
        'should appear as dragging even if another source initiated it',
        fakeAsync(() => {
            const fx2 = init(9999);
            const other = fx2.componentInstance.source.getHandlerId();
            let isDragging = false;
            component.isDragging$.subscribe(d => (isDragging = d));
            backend.simulateBeginDrag([other]);
            tick();
            expect(isDragging).toBeTruthy();
        })
    );
});
