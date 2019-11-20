import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingsubsPage } from './trainingsubs.page';

describe('TrainingsubsPage', () => {
  let component: TrainingsubsPage;
  let fixture: ComponentFixture<TrainingsubsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingsubsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsubsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
