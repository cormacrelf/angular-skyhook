import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxDragPreviewComponent } from './box-drag-preview.component';

describe('BoxDragPreviewComponent', () => {
  let component: BoxDragPreviewComponent;
  let fixture: ComponentFixture<BoxDragPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxDragPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxDragPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
