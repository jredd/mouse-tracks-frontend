import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from "./dialogue-planner-content.interface";
import { Observable, Subscription } from "rxjs";
import {ContentType, Experience, ItineraryItem, Location, Trip} from "../../store";
import { select, Store } from "@ngrx/store";
import * as fromLocationStore from "../../store/location";
import { AppState } from "../../store/app.state";
import * as fromItineraryItemStore from '../../store/itinerary-item/';
import * as fromTripStore from '../../store/trip/';


@Component({
  selector: 'app-dialogue-planner-content',
  templateUrl: './dialogue-planner-content.component.html',
  styleUrls: ['./dialogue-planner-content.component.scss']
})
export class DialoguePlannerContentComponent implements AfterViewInit, OnInit, OnDestroy {

  public form: FormGroup;
  public FormType = FormType;  // to access the enum from template
  public currentFormType: FormType;
  currentTrip: Trip | null = null;
  private tripSubscription: Subscription | null = null;
  isFormReady = false;
  locations$: Observable<Location[]> = this.store.pipe(select(fromLocationStore.selectAllLocations));
  trip$: Observable<Trip | null> = this.store.pipe(select(fromTripStore.selectCurrentTrip))
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DialoguePlannerContentComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: { type: FormType, title: string, experience: Experience }
  ) {
    this.currentFormType = data.type;
  }

  ngOnInit() {
    this.form = this.fb.group({
      event_time: [null, Validators.required] // Add this line for the 'event_time' control
    });

    this.tripSubscription = this.trip$.subscribe(trip => {
      this.currentTrip = trip;
    });
  }


  initForm() {
    switch (this.currentFormType) {
      case FormType.MEAL:
        this.form = this.fb.group({
            start_time: [''],
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
          start_time: [null],
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

  createNewActivity(): any {
    switch (this.currentFormType) {
      case FormType.MEAL:
        return {
          // reservation_time: this.form.get('reservation_time')?.value,
          meal_type: this.form.get('meal_type')?.value,
          meal_experience_id: this.data.experience.id,
          meal_experience: this.data.experience,
          // meal_experience_id
          // meal_experience: this.form.get()
          // notes: this.form.get('notes')?.value,
        };
      case FormType.TRAVEL_EVENT:
        return {
          from_location: this.form.get('from_location')?.value,
          to_location: this.form.get('to_location')?.value,
          custom_from_location: this.form.get('custom_from_location')?.value,
          custom_to_location: this.form.get('custom_to_location')?.value,
          travel_type: this.form.get('travel_type')?.value,
          // event_time: this.form.get('event_time')?.value,
          // notes: this.form.get('notes')?.value,
        };
      case FormType.NOTES:
        return {};
      case FormType.BREAK:
        return {
          location: this.form.get('location')?.value,
          // notes: this.form.get('notes')?.value,
        };
      default:
        return null;
    }
  }


  onSave() {
    if (this.form.valid) {
      const newActivity = this.createNewActivity();
      const notes = this.form.get('notes')?.value
      // const newOrder = /* specify the activity order */;
      // const trip = /* specify the trip details */;
      // const contentType = /* specify the content type */;

      if (this.currentTrip) {
        // this.store.dispatch(fromItineraryItemStore.addActivityToMyDay({
        //   itineraryItem: {
        //     activity: newActivity,
        //     activity_order: 50,
        //     trip: this.currentTrip,
        //     content_type: this.currentFormType.toLowerCase() as ContentType,
        //     notes: notes,
        //     start_time: this.form.get('start_time')?.value,
        //   }
        // }));
        let itineraryItem: Partial<ItineraryItem> = {
          activity_order: 50,
          trip: this.currentTrip,
          notes: notes,
        };

        const startTime = this.form.get('start_time')?.value;
        const endTime = this.form.get('end_time')?.value;
        console.log('content type:', itineraryItem.content_type)
        console.log('form type:', this.currentFormType)
        if (this.currentFormType != 'note') {
          itineraryItem = { ...itineraryItem, activity: newActivity, content_type: this.currentFormType.toLowerCase() as ContentType };
        }

        if (startTime) {
          itineraryItem = { ...itineraryItem, start_time: startTime };
        }

        if (endTime) {
          itineraryItem = { ...itineraryItem, end_time: endTime };
        }

        this.store.dispatch(fromItineraryItemStore.addActivityToMyDay({
          itineraryItem
        }));
      } else {
        console.log("Error: Trip is not set")
      }
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

  ngOnDestroy(): void {
    if (this.tripSubscription) {
      this.tripSubscription.unsubscribe();
    }
  }
}
