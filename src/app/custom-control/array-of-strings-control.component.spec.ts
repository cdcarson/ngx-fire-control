import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayOfStringsControlComponent } from './array-of-strings-control.component';

describe('ArrayOfStringsControlComponent', () => {
  let component: ArrayOfStringsControlComponent;
  let fixture: ComponentFixture<ArrayOfStringsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrayOfStringsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayOfStringsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
