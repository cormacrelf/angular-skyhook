import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDragLayerComponent } from './custom-drag-layer.component';

describe('CustomDragLayerComponent', () => {
  let component: CustomDragLayerComponent;
  let fixture: ComponentFixture<CustomDragLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDragLayerComponent ]
    })
    .compileComponents();
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
