import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { concat, concatMap, EMPTY, forkJoin, of, withLatestFrom } from 'rxjs';
import { mergeMap, map, catchError, tap, filter } from 'rxjs/operators';

import * as ItineraryActions from './itinerary-item.actions';
import { TripService } from "../../components/trip-dashboard/trip-dashboard.service";
import { ExistingItineraryItem, NewItineraryItem } from "./itinerary-item.interfaces";
import * as fromItineraryItemStore from './';

import { Store } from "@ngrx/store";
import { AppState } from "../app.state";
import { NgxIndexedDBService } from "ngx-indexed-db";

@Injectable()
export class ItineraryItemEffects {

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private tripService: TripService,
    private dbService: NgxIndexedDBService
  ) {}

  getItineraryItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItineraryActions.getItineraryItemsRequest),
      mergeMap(action => this.tripService.getItineraryItems(action.trip_id).pipe(
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

  saveAllItemsByDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItineraryActions.saveAllNonEmptyDays),
      tap(() => console.log('Effect saveAllItemsByDay$ triggered!')),
      withLatestFrom(
        this.store.select(fromItineraryItemStore.selectNonEmptyDaysWithItems),
        this.store.select(fromItineraryItemStore.selectAllDeletedItems)
      ),
      mergeMap(([action, daysWithItems, deletedItems]) => {
        // Split the items into new and existing across all days
        const allNewItems = daysWithItems
          .flatMap(day => day.items)
          .filter(item => 'tempId' in item) as NewItineraryItem[];

        const allExistingItems = daysWithItems
          .flatMap(day => day.items)
          .filter(item => 'id' in item) as ExistingItineraryItem[];

        const newTasks = allNewItems.length ? [this.tripService.bulkSaveItineraryItems(allNewItems)] : [];
        const updateTasks = allExistingItems.length ? [this.tripService.bulkUpdateItineraryItems(allExistingItems)] : [];

        const allDeletedItems = deletedItems.filter(isExistingItineraryItem);
        const deleteTasks = allDeletedItems.length ? [this.tripService.bulkDeleteItineraryItems(allDeletedItems)] : [];

        return forkJoin([...newTasks, ...updateTasks, ...deleteTasks]).pipe(
          map(results => ({ results, allNewItems }))
        );
      }),
      mergeMap(({ results, allNewItems }) => {
        const updateDbObservables = allNewItems.map((item, index) => {
    if (results[0]) {
      const newItem = results[0][index];
      const tempId = item.tempId;

      return of(tempId).pipe(  // Wrapping tempId in an observable for debugging
        concatMap(() => this.dbService.delete('itinerary_item', tempId)),
        concatMap(() => this.dbService.add('itinerary_item', newItem)),
        tap(() => {
          this.store.dispatch(ItineraryActions.replaceItem({ tempId, newItem }));
        }),
        map(() => null)
      );
    }
    return [];
  });
  //       const updateDbObservables = allNewItems.map((item, index) => {
  //         console.log("Inside map with item:", item);
  //         return of('mock delete directly').pipe(
  //           delay(100),
  //           tap(val => console.log('turtles:', val))
  //         );
  //       });
        return concat(...updateDbObservables).pipe(
          tap(obs => console.log("Emitting from updateDbObservables:", obs)),
          filter(result => result !== null),
          mergeMap(() => [
            ItineraryActions.saveAllSuccess(),
            ItineraryActions.clearDeletedItems()
          ])
        );
      }),
      catchError((error) => of(ItineraryActions.saveAllFailure({ error })))
    )
  );

}
function isExistingItineraryItem(item: any): item is ExistingItineraryItem {
  return 'id' in item && item.id !== undefined;
}
