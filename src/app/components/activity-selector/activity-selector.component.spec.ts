import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySelectorComponent } from './activity-selector.component';

describe('ActivitySelectorComponent', () => {
  let component: ActivitySelectorComponent;
  let fixture: ComponentFixture<ActivitySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
