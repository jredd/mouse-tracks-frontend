import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formDimensions, FormType } from "./dialogue-planner-content.interface";
import { Observable, Subscription } from "rxjs";
import { Break, ContentType, Experience, ItineraryItem, Location, Meal, TravelEvent, Trip } from "../../store";
import { select, Store } from "@ngrx/store";
import * as fromLocationStore from "../../store/location";
import { AppState } from "../../store/app.state";
import * as fromItineraryItemStore from '../../store/itinerary-item/';
import * as fromTripStore from '../../store/trip/';
import { take } from "rxjs/operators";


@Component({
  selector: 'app-dialogue-planner-content',
  templateUrl: './dialogue-planner-content.component.html',
  styleUrls: ['./dialogue-planner-content.component.scss']
})
export class DialoguePlannerContentComponent implements AfterViewInit, OnInit, OnDestroy {

  public form: FormGroup;
  public FormType = FormType;  // to access the enum from template
  public currentFormType: FormType;
  private tripSubscription: Subscription | null = null;
  private subscriptions: Subscription[] = [];

  currentTrip: Trip | null = null;
  height = '150px'; // can also add height if needed
  width = '600px'
  isFormReady = false;
  locations$: Observable<Location[]> = this.store.pipe(select(fromLocationStore.selectAllLocations));
  trip$: Observable<Trip | null> = this.store.pipe(select(fromTripStore.selectCurrentTrip))
  currentDayItems: Observable<ItineraryItem[]> = this.store.select(fromItineraryItemStore.selectItemsForCurrentDay);

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DialoguePlannerContentComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: { type: FormType, title: string, itineraryItem: ItineraryItem, activity: Experience, index: number | null }
  ) {
    this.currentFormType = data.type;
  }

  ngOnInit() {
    this.height = formDimensions[this.data.type];
    this.form = this.fb.group({
      event_time: [null, Validators.required] // Add this line for the 'event_time' control
    });

    this.tripSubscription = this.trip$.subscribe(trip => {
      this.currentTrip = trip;
    });
  }

  locationOrCustomValidator(locationKey: string, customLocationKey: string) {
    return (group: FormGroup): ValidationErrors | null => {
        const locationValue = group.controls[locationKey].value;
        const customLocationValue = group.controls[customLocationKey].value;

        if (!locationValue && !customLocationValue) {
            return { 'neitherProvided': true };
        }
        return null;
    };
  }

  compareLocations(l1: any, l2: any): boolean {
    return l1 && l2 ? l1.id === l2.id : l1 === l2;
  }

  initForm() {
    const item: ItineraryItem = this.data.itineraryItem || {};
    let activity = item.activity
    // console.log(this.currentFormType)
    switch (this.currentFormType) {
      case FormType.MEAL:
        activity = item.activity as Meal
        this.form = this.fb.group({
            start_time: [item.start_time || ''],
            meal_type: [activity?.meal_type || 'breakfast', Validators.required],
            note: [item.note || '']
        });
        break;
      case FormType.TRAVEL_EVENT:
        activity = item.activity as TravelEvent
        // console.log('event:', activity)
        this.form = this.fb.group({
          from_location: [activity?.from_location || ''],
          to_location: [activity?.to_location || ''],
          custom_from_location: [activity?.custom_from_location || ''],
          custom_to_location: [activity?.custom_to_location || ''],
          travel_type: [activity?.travel_type || '', Validators.required],
          start_time: [item.start_time || null],
          note: [item.note || '']
        }, {
          validators: [
            this.locationOrCustomValidator('from_location', 'custom_from_location'),
            this.locationOrCustomValidator('to_location', 'custom_to_location')
          ]
        });

        // console.log("herps:", this.form)
        // console.log("activity:", item)

        const fromLocationControl = this.form.get('from_location')!;
        this.subscriptions.push(fromLocationControl.valueChanges.subscribe(val => {
          if (val) {
            this.form.get('custom_from_location')!.setValue(null, { emitEvent: false });
            this.form.get('custom_from_location')!.disable({ emitEvent: false });
          } else {
            this.form.get('custom_from_location')!.enable({ emitEvent: false });
          }
        }));

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
      case FormType.NOTE:
        this.form = this.fb.group({
          note: [item.note || '', Validators.required],
          start_time: [item.start_time || ''],
          end_time: [item.end_time || '']
        });
        break;
      case FormType.BREAK:
        activity = item.activity as Break
        this.form = this.fb.group({
          location: [activity?.location || '', Validators.required],
          note: [item.note || '']
        });
        break;
      case FormType.EXPERIENCE:
        this.form = this.fb.group({
          start_time: [item?.start_time || ''],
          note: [item?.note || '']
        });
        break;

      default:
        this.form = this.fb.group({});
        break;
    }

    this.form.markAsPristine();
  }

  createNewActivity(): any {
    switch (this.currentFormType) {
      case FormType.MEAL:
        return {
          meal_type: this.form.get('meal_type')?.value,
          meal_experience_id: this.data.activity.id,
          meal_experience: this.data.activity,
        };
      case FormType.TRAVEL_EVENT:
        return {
          from_location: this.form.get('from_location')?.value,
          from_location_id: this.form.get('from_location')?.value?.id,
          to_location: this.form.get('to_location')?.value,
          to_location_id: this.form.get('to_location')?.value?.id,
          custom_from_location: this.form.get('custom_from_location')?.value,
          custom_to_location: this.form.get('custom_to_location')?.value,
          travel_type: this.form.get('travel_type')?.value,
        };
      case FormType.NOTE:
        return {};
      case FormType.BREAK:
        return {
          location: this.form.get('location')?.value,
        };
      default:
        return null;
    }
  }

  onAdd() {
    if (this.form.valid) {
      const newActivity = this.createNewActivity();
      const note = this.form.get('note')?.value

      if (this.currentTrip) {
        let itineraryItem: Partial<ItineraryItem> = {
          activity_order: 50,
          trip: this.currentTrip.id,
          note: note,
        };

        if (this.currentFormType == FormType.NOTE) {
          itineraryItem.content_type = 'note'
        }

        const startTime = this.form.get('start_time')?.value;
        const endTime = this.form.get('end_time')?.value;
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
        if (this.data.index != null) {
          // Using the currentDayItems observable
          this.subscriptions.push(this.currentDayItems.pipe(
              take(1)  // Take just one emitted value
          ).subscribe(currentItems => {
            if (this.data.index != null) {
              const fromIndex = currentItems.length - 1; // Assuming the new item gets added to the end
              const toIndex = this.data.index;
              console.log(fromIndex, toIndex)
              this.store.dispatch(fromItineraryItemStore.reorderMyDayActivities({ fromIndex, toIndex }));
            }
          }));
        }
      } else {
        console.log("Error: Trip is not set")
      }
      this.form.markAsPristine();
      this.dialogRef.close(this.form.value);
    }
  }

  onDone() {
    const item: ItineraryItem = this.data.itineraryItem;
    if (!item) {
      console.log("there should be an item");
      return;
    }

    let updatedItem: ItineraryItem = {...item};

    switch (this.currentFormType) {
      case FormType.EXPERIENCE:
        updatedItem.note = this.form.get('note')?.value || null;
        updatedItem.start_time = this.form.get('start_time')?.value || null;
        break;

      case FormType.MEAL:
        const mealActivity = item.activity as Meal;
        updatedItem.start_time = this.form.get('start_time')?.value || null;
        updatedItem.note = this.form.get('note')?.value || null;
        updatedItem.activity = {
            ...mealActivity,
            meal_type: this.form.get('meal_type')?.value || 'breakfast' // assuming default as 'breakfast' is desired
        };
        break;

      case FormType.TRAVEL_EVENT:
        const travelEventActivity = item.activity as TravelEvent;

        updatedItem.note = this.form.get('note')?.value || null;
        updatedItem.start_time = this.form.get('start_time')?.value || null;
        updatedItem.activity = {
            ...travelEventActivity,
            from_location: this.form.get('from_location')?.value || null,
            from_location_id: this.form.get('from_location')?.value.id || null,
            to_location: this.form.get('to_location')?.value || null,
            to_location_id: this.form.get('to_location')?.value.id || null,
            custom_from_location: this.form.get('custom_from_location')?.value || null,
            custom_to_location: this.form.get('custom_to_location')?.value || null,
            travel_type: this.form.get('travel_type')?.value || null
        };
        console.log(updatedItem)
        break;

      case FormType.NOTE:
        updatedItem.note = this.form.get('note')?.value || null;
        updatedItem.start_time = this.form.get('start_time')?.value || null;
        updatedItem.end_time = this.form.get('end_time')?.value || null;
        break;

      case FormType.BREAK:
        const breakActivity = item.activity as Break;
        updatedItem.note = this.form.get('note')?.value || null;
        updatedItem.activity = {
            ...breakActivity,
            location: this.form.get('location')?.value || null
        };
        break;

      default:
        console.log('Unknown form type:', this.currentFormType);
    }

    // After processing based on the form type, dispatch to your store
    this.store.dispatch(fromItineraryItemStore.updateItem({ updatedItem }));
    this.dialogRef.close();
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
