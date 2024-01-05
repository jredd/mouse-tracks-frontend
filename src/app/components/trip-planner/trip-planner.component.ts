import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {select, Store} from "@ngrx/store";
import {BehaviorSubject, EMPTY, Observable, of, Subject, takeUntil} from "rxjs";

import { loadDestinations, selectAllDestinations, selectAllDestinationsLoading } from "../../store/destination";
import { fadeIn, fadeInOut } from "../trip-dashboard/trip-dashboard.animation";
import * as tripSelector from '../../store/trip/trip.selectors';
import * as tripActions from '../../store/trip/trip.actions';
import { Destination, Trip } from "../../store";
import { AppState } from "../../store/app.state";
import {Router} from "@angular/router";
import {filter, first, map, take} from "rxjs/operators";
import {selectUserId} from "../../store/auth/auth.selectors";


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
  userId: string;

  constructor(
    private store: Store<AppState>,
    private router: Router,
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
    this.store.select(selectUserId).pipe(first()).subscribe(id => this.userId = id);
    this.store.select(tripSelector.selectCurrentTrip).subscribe(trip => {
      this._currentTrip.next(trip);
      if (trip) {
        // Edit mode
        this.editTrip.patchValue({
          title: trip.title,
          destination: trip.destination,
          dateRange: {
            start: this.stringToDate(trip.start_date),
            end: this.stringToDate(trip.end_date)
          }
        });
        this.editTrip.enable();
      }
    });

    this.isLoading$.subscribe(trips => {
      this.editTrip.enable()
    });

    this.editTrip.valueChanges.subscribe(val => {
      const tripTitle = this.getTripTitle();
      const currentTrip = this._currentTrip.value;
      if (currentTrip && currentTrip.title !== tripTitle) {
        this.store.dispatch(tripActions.updateTripTitle({newTitle: tripTitle}));
      }
    });
  }

  stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  createTrip(tripData: Partial<Trip>): void {
    // Dispatch the action to create the trip
    this.store.dispatch(tripActions.createTripRequest({ trip: tripData }));

    // Subscribe to the currentTrip$ just once to get the newly created trip and navigate
    this.store.pipe(
        select(tripSelector.selectCurrentTrip),
        filter(trip => !!trip),  // Ensure the trip is not null or undefined
        take(1)
    ).subscribe(trip => {
      if (trip) {
        this.router.navigate(['/trip/planner', trip.id]);
      }
    });
  }


  updateTrip(trip: Partial<Trip>): void {
    this.store.dispatch(tripActions.updateTrip({ trip: trip }));
    // Handle trip update logic
  }

  onSubmit(): void {
    if (this.editTrip.valid) {
      const currentTrip = this._currentTrip.value;

      if (currentTrip) {
        // const trip = this.prepareUpdateFormData();
        // if (trip) {
        //   this.updateTrip(trip);  // Update the existing trip
        // } else {
        //   console.log('Preparing the form data failed', trip);
        // }
      } else {
        this.createTrip(this.prepareCreateFormData());  // Create a new trip
      }
    }
  }

  getTripTitle(): string {
    return this.editTrip.value.title
  }

  // private prepareCreateFormData(): Partial<Trip> {
  //   const formData = this.editTrip.value;
  //   let userId: string;
  //   this.userId$.subscribe(id => userId = id); // Subscribe to get the user ID
  //
  //   console.log("destination:", formData.destination)
  //   return {
  //     title: formData.title,
  //     created_by: userId,
  //     destination_id: formData.destination,
  //     start_date: formData.dateRange.start,
  //     end_date: formData.dateRange.end
  //   };
  // }

  private prepareCreateFormData(): Partial<Trip> {
    const formData = this.editTrip.value;

    // Make sure userId is available
    if (!this.userId) {
      // Handle the case where userId is not available
      console.error('User ID is not available');
      return {};
    }

    console.log("destination:", formData.destination)
    return {
      title: formData.title,
      created_by: this.userId, // Use the userId from the component property
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
