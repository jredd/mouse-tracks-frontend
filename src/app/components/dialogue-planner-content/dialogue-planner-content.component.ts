import {AfterViewInit, Component, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

enum FormType {
  RESTAURANT = 'restaurant',
  TRAVEL_EVENT = 'travel_event',
  NOTES = 'notes',
  BREAK = 'break'
}

@Component({
  selector: 'app-dialogue-planner-content',
  templateUrl: './dialogue-planner-content.component.html',
  styleUrls: ['./dialogue-planner-content.component.scss']
})
export class DialoguePlannerContentComponent implements AfterViewInit{

  public form: FormGroup;
  public FormType = FormType;  // to access the enum from template
  public currentFormType: FormType;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialoguePlannerContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: FormType }
  ) {
    this.currentFormType = data.type;
    // this.initForm();
  }

  ngAfterViewInit() {
    this.initForm();
  }

  initForm() {
    switch (this.currentFormType) {
      case FormType.RESTAURANT:
        this.form = this.fb.group({
          reservation_time: ['', Validators.required],
          meal_type: ['breakfast', Validators.required],
          notes: ['']
        });
        break;
      case FormType.TRAVEL_EVENT:
        this.form = this.fb.group({
          from_location: ['', Validators.required],
          to_location: ['', Validators.required],
          custom_from_location: [''],
          custom_to_location: [''],
          travel_type: ['', Validators.required]
        });
        break;
      case FormType.NOTES:
        this.form = this.fb.group({
          notes: ['', Validators.required],
          start_time: [''],
          end_time: ['']
        });
        break;
      case FormType.BREAK:
        this.form = this.fb.group({
          location: ['', Validators.required]
        });
        break;
    }
  }

  onSave() {
    if (this.form.valid) {
      // Save data here or emit an event with the form value
      this.dialogRef.close(this.form.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
