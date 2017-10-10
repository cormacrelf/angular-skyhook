import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortedComponent } from './sorted.component';

describe('SortedComponent', () => {
  let component: SortedComponent;
  let fixture: ComponentFixture<SortedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
