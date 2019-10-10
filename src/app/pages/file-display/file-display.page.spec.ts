import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDisplayPage } from './file-display.page';

describe('FileDisplayPage', () => {
  let component: FileDisplayPage;
  let fixture: ComponentFixture<FileDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
