import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormType} from "./dialogue-planner-content.interface";
import {Observable} from "rxjs";
import {Location} from "../../store";
import {select, Store} from "@ngrx/store";
import * as fromLocationStore from "../../store/location";
import {AppState} from "../../store/app.state";


@Component({
  selector: 'app-dialogue-planner-content',
  templateUrl: './dialogue-planner-content.component.html',
  styleUrls: ['./dialogue-planner-content.component.scss']
})
export class DialoguePlannerContentComponent implements AfterViewInit, OnInit {

  public form: FormGroup;
  public FormType = FormType;  // to access the enum from template
  public currentFormType: FormType;
  isFormReady = false;
  locations$: Observable<Location[]> = this.store.pipe(select(fromLocationStore.selectAllLocations));

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DialoguePlannerContentComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: { type: FormType, title: string }
  ) {
    this.currentFormType = data.type;
  }

  ngOnInit() {
    this.form = this.fb.group({
      // ... your other controls ...
      event_time: [null, Validators.required] // Add this line for the 'event_time' control
    });
  }


  initForm() {
    switch (this.currentFormType) {
      case FormType.MEAL:
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
          travel_type: ['', Validators.required],
          event_time: [null],
          notes: ['']
        });

          const fromLocationControl = this.form.get('from_location')!;
          fromLocationControl.valueChanges.subscribe(val => {
              if (val) {
                  this.form.get('custom_from_location')!.setValue(null, { emitEvent: false });
                  this.form.get('custom_from_location')!.disable({ emitEvent: false });
              } else {
                  this.form.get('custom_from_location')!.enable({ emitEvent: false });
              }
          });

              const customFromLocationControl = this.form.get('custom_from_location')!;
              customFromLocationControl.valueChanges.subscribe(val => {
                  if (val) {
                      this.form.get('from_location')!.setValue(null, { emitEvent: false });
                      this.form.get('from_location')!.disable({ emitEvent: false });
                  } else {
                      this.form.get('from_location')!.enable({ emitEvent: false });
                  }
              });

              const toLocationControl = this.form.get('to_location')!;
              toLocationControl.valueChanges.subscribe(val => {
                  if (val) {
                      this.form.get('custom_to_location')!.setValue(null, { emitEvent: false });
                      this.form.get('custom_to_location')!.disable({ emitEvent: false });
                  } else {
                      this.form.get('custom_to_location')!.enable({ emitEvent: false });
                  }
              });

              const customToLocationControl = this.form.get('custom_to_location')!;
              customToLocationControl.valueChanges.subscribe(val => {
                  if (val) {
                      this.form.get('to_location')!.setValue(null, { emitEvent: false });
                      this.form.get('to_location')!.disable({ emitEvent: false });
                  } else {
                      this.form.get('to_location')!.enable({ emitEvent: false });
                  }
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
                location: ['', Validators.required],
                notes: ['']
              });
              break;
          default:
              this.form = this.fb.group({});
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

  ngAfterViewInit() {
    this.isFormReady = true;
    this.initForm();
    this.cdr.detectChanges();
  }
}
