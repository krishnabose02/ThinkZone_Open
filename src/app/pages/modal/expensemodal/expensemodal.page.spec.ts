import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensemodalPage } from './expensemodal.page';

describe('ExpensemodalPage', () => {
  let component: ExpensemodalPage;
  let fixture: ComponentFixture<ExpensemodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensemodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensemodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
