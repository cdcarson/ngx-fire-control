import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseControlStatusComponent } from './firebase-control-status.component';

describe('FirebaseControlStatusComponent', () => {
  let component: FirebaseControlStatusComponent;
  let fixture: ComponentFixture<FirebaseControlStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirebaseControlStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseControlStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
