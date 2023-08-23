import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialoguePlannerContentComponent } from './dialogue-planner-content.component';

describe('DialogueContentComponent', () => {
  let component: DialoguePlannerContentComponent;
  let fixture: ComponentFixture<DialoguePlannerContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialoguePlannerContentComponent]
    });
    fixture = TestBed.createComponent(DialoguePlannerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
