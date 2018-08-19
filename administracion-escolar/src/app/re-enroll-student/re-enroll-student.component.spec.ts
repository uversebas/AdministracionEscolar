import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReEnrollStudentComponent } from './re-enroll-student.component';

describe('ReEnrollStudentComponent', () => {
  let component: ReEnrollStudentComponent;
  let fixture: ComponentFixture<ReEnrollStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReEnrollStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReEnrollStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
