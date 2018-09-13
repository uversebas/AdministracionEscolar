import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaNuevaComponent } from './tabla-nueva.component';

describe('TablaNuevaComponent', () => {
  let component: TablaNuevaComponent;
  let fixture: ComponentFixture<TablaNuevaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaNuevaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaNuevaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
