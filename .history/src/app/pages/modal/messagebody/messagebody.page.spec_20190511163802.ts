import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagebodyPage } from './messagebody.page';

describe('SigninPage', () => {
  let component: MessagebodyPage;
  let fixture: ComponentFixture<MessagebodyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagebodyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagebodyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
