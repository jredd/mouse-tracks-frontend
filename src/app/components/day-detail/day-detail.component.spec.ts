import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDetailComponent } from './day-detail.component';

describe('DayDetailComponent', () => {
  let component: DayDetailComponent;
  let fixture: ComponentFixture<DayDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayDetailComponent]
    });
    fixture = TestBed.createComponent(DayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
