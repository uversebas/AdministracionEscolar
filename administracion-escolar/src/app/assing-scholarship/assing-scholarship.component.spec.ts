import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingScholarshipComponent } from './assing-scholarship.component';

describe('AssingScholarshipComponent', () => {
  let component: AssingScholarshipComponent;
  let fixture: ComponentFixture<AssingScholarshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssingScholarshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssingScholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
