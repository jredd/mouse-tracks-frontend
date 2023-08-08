import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {of, take, delay} from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { TripService } from "../../components/trip-dashboard/trip-dashboard.service";
import * as tripActions from './trip.actions';
import { selectTripNotFoundInStore} from "./trip.selectors";
import { Store } from '@ngrx/store';


@Injectable()
export class TripEffects {
  constructor(
    private actions$: Actions,
    private tripService: TripService,
    private store: Store
  ) {}

  loadTrips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tripActions.loadTrips),
      mergeMap(() =>
        this.tripService.getTrips().pipe(
          map(trips => tripActions.loadTripsSuccess({ trips })),
          catchError(error => of(tripActions.loadTripsFailure({ error })))
        )
      )
    )
  );

  loadTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tripActions.loadTrip),
      mergeMap(action =>
        this.tripService.getTrip(action.trip_id).pipe(
          map(trip => tripActions.tripLoaded({ trip })),
          catchError(error => of(tripActions.loadTripError({ error })))
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
            console.log(tripNotFoundInStore, action.trip_id)
              if (!tripNotFoundInStore) {
                console.log("trip not found so fetch")
                return tripActions.loadTrip({ trip_id: action.trip_id });
              } else {
                console.log("dummy action")
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
}
