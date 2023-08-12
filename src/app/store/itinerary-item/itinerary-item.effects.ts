// experience.effects.ts
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {EMPTY, of} from 'rxjs';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';

import * as ItineraryActions from './itinerary-item.actions';
import { AppService } from "../../app.service";
import {TripService} from "../../components/trip-dashboard/trip-dashboard.service";

@Injectable()
export class ItineraryItemEffects {

  constructor(
    private actions$: Actions,
    private tripService: TripService
  ) {}

  getItineraryItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItineraryActions.getItineraryItemsRequest),
      mergeMap(action => this.tripService.getItineraryItems(action.tripId).pipe(
        map(items => ItineraryActions.getItineraryItemsSuccess({ items })),
        catchError(() => EMPTY) // You could also dispatch a failure action here
      ))
    )
  );

  createItineraryItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItineraryActions.createItineraryItemRequest),
      mergeMap(action => this.tripService.createItineraryItem(action.tripId, action.item).pipe(
        map(item => ItineraryActions.createItineraryItemSuccess({ item })),
        catchError(() => EMPTY) // You could also dispatch a failure action here
      ))
    )
  );

  // Add more effects here for other actions like update, delete, etc. if necessary.
}
