import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {from, of, switchMap, take} from 'rxjs';
import { catchError, map, mergeMap, concatMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TripService } from "../../components/trip-dashboard/trip-dashboard.service";
import * as tripActions from './trip.actions';
import * as fromItineraryItem from '../itinerary-item';
import { selectTripNotFoundInStore} from "./trip.selectors";
import {generateEmptyDateRange} from "../itinerary-item";
import {loadTripError, loadTripsSuccess} from "./trip.actions";


@Injectable()
export class TripEffects {
  constructor(
    private actions$: Actions,
    private tripService: TripService,
    private store: Store
  ) {}

  loadTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tripActions.loadTrip), // Your action to load a trip
      switchMap(action =>
        this.tripService.getTrip(action.trip_id).pipe(
          switchMap(trip => {
            const itemsByDay = generateEmptyDateRange(trip.start_date, trip.end_date);
            // Use from to emit each action individually
            return from([
              tripActions.tripLoaded({ trip }),
              fromItineraryItem.initializeItinerary({ itemsByDay })
            ]);
          }),
          catchError((error) => of(tripActions.loadTripError({ error })))
        )
      )
    )
  );

  loadTripWhenNotFound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tripActions.setCurrentTrip),
      concatMap(action =>
        this.store.select(selectTripNotFoundInStore).pipe(
          take(1),  // Only take one emission from the store
          map(tripNotFoundInStore => {
            // console.log(tripNotFoundInStore, action.trip_id)
              if (!tripNotFoundInStore) {
                // console.log("trip not found so fetch")
                return tripActions.loadTrip({ trip_id: action.trip_id });
              } else {
                // console.log("dummy action")
                return { type: '[Trip] No Operation' }; // Dispatch a dummy action
              }
          })
        )
      )
    )
  );

  createTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tripActions.createTripRequest),
      mergeMap(action =>
        this.tripService.createTrip(action.trip).pipe(
          map(trip => tripActions.createTripSuccess({ trip })),
          catchError(error => of(tripActions.createTripFailure({ error })))
        )
      )
    )
  );

  updateTrip$ = createEffect(() => this.actions$.pipe(
    ofType(tripActions.updateTrip),
    mergeMap(action => this.tripService.updateTrip(action.trip)
      .pipe(
        map(updatedTrip => tripActions.updateTripSuccess({ updatedTrip })),
        catchError(error => of(tripActions.updateTripFailure({ error })))
      ))
  ));

  loadTrips$ = createEffect(() =>
    this.actions$.pipe(
        ofType(tripActions.loadTrips),  // Listen to the '[Trip] Load Trips' action
        mergeMap(() => this.tripService.getTrips()  // Call the service method
            .pipe(
                map(trips => tripActions.loadTripsSuccess({ trips })),  // Dispatch the success action with the received trips
                catchError(error => of(tripActions.loadTripError({ error })))  // Handle any error
            )
        )
    )
);

}
