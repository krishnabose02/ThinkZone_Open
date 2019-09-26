import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfeedbackPage } from './userfeedback.page';

describe('UserfeedbackPage', () => {
  let component: UserfeedbackPage;
  let fixture: ComponentFixture<UserfeedbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserfeedbackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserfeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
