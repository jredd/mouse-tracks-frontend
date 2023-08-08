import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from "@ngrx/store";
import {BehaviorSubject, EMPTY, Observable, of, Subject} from "rxjs";

import { loadDestinations, selectAllDestinations, selectAllDestinationsLoading } from "../../store/destination";
import {disabledFadeIn, fadeIn, fadeInOut} from "../trip-dashboard/trip-dashboard.animation";
import * as tripSelector from '../../store/trip/trip.selectors';
import * as tripActions from '../../store/trip/trip.actions';
import { Destination, Trip } from "../../store";
import { AppState } from "../../store/app.state";


@Component({
  selector: 'app-trip-planner',
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.scss'],
  animations: [fadeIn, fadeInOut],
})
export class TripPlannerComponent implements OnInit, OnDestroy {

  destinations$: Observable<Destination[]> = EMPTY;
  isDestinationsLoading$: Observable<boolean> = this.store.select(selectAllDestinationsLoading);
  private _currentTrip = new BehaviorSubject<Trip | null>(null);
  currentTrip$ = this._currentTrip.asObservable();
  isLoading$: Observable<boolean> = this.store.select(tripSelector.selectLoading);
  editTrip: FormGroup;
  private destroy$ = new Subject<void>();


  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.isLoading$ = this.store.select(tripSelector.selectLoading);
    this.editTrip = this.fb.group({
      title: ['', Validators.required],
      destination: ['', Validators.required],
      dateRange: this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.destinations$ = this.store.select(selectAllDestinations);
    this.store.dispatch(loadDestinations());
    this.editTrip.disable();  // Disable the form while loading

    this.store.select(tripSelector.selectCurrentTrip).subscribe(trip => {
      this._currentTrip.next(trip);
      if (trip) {
        // Edit mode
        this.editTrip.patchValue({
            title: trip.title,
            destination: trip.destination,
            dateRange: {
                start: trip.start_date,
                end: trip.end_date
            }
        });
        this.editTrip.enable();
      }
    });

    this.isLoading$.subscribe(trips => {
      this.editTrip.enable()
    });

  }
  createTrip(tripData: Partial<Trip>): void {
    // Handle trip creation logic
    this.store.dispatch(tripActions.createTripRequest({ trip: tripData }));
  }

  updateTrip(trip: Partial<Trip>): void {
    this.store.dispatch(tripActions.updateTrip({ trip: trip }));
    // Handle trip update logic
  }

  onSubmit(): void {
    if (this.editTrip.valid) {
      const currentTrip = this._currentTrip.value;

      if (currentTrip) {
        const trip = this.prepareUpdateFormData();
        if (trip) {
          this.updateTrip(trip);  // Update the existing trip
        } else {
          console.log('Preparing the form data failed', trip);
        }
      } else {
        console.log('Create Trip')
        this.createTrip(this.prepareCreateFormData());  // Create a new trip
      }
    }
  }

  prepareUpdateFormData(): Partial<Trip> | null {
    const formData = this.editTrip.value;
    return {
      title: formData.title,
      destination_id: formData.destination,
      start_date: formData.dateRange.start,
      end_date: formData.dateRange.end
    }
  }

  private prepareCreateFormData(): Partial<Trip> {
    const formData = this.editTrip.value;
    console.log("destination:", formData.destination)
    return {
      title: formData.title,
      created_by: 'a56ea5a9-2101-4df9-8d39-9fd762c8e11f',
      destination_id: formData.destination,
      start_date: formData.dateRange.start,
      end_date: formData.dateRange.end
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
