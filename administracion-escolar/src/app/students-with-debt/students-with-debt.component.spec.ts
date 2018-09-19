import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsWithDebtComponent } from './students-with-debt.component';

describe('StudentsWithDebtComponent', () => {
  let component: StudentsWithDebtComponent;
  let fixture: ComponentFixture<StudentsWithDebtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsWithDebtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsWithDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
