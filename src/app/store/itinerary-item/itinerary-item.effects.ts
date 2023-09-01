import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, forkJoin, of, switchMap, withLatestFrom } from 'rxjs';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';

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
      tap(() => console.log('Effect triggered!')),
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

      // Create tasks based on new and existing items
      const newTasks = allNewItems.length ? [this.tripService.bulkSaveItineraryItems(allNewItems)] : [];
      const updateTasks = allExistingItems.length ? [this.tripService.bulkUpdateItineraryItems(allExistingItems)] : [];

      // Delete tasks for the deleted items
      const allDeletedItems = deletedItems.filter(isExistingItineraryItem);
      const deleteTasks = allDeletedItems.length ? [this.tripService.bulkDeleteItineraryItems(allDeletedItems)] : [];

      // Combine all tasks
      return forkJoin([...newTasks, ...updateTasks, ...deleteTasks]).pipe(
      // return forkJoin([...newTasks, ...deleteTasks]).pipe(
        map(results => ({ results, allNewItems }))
      );
    }),
      mergeMap(({ results, allNewItems }) => {
      // Here, results would contain the combined results of new, updated, and deleted tasks.
      // And you have access to allNewItems as well.
      // You can perform logic to update the local DB and state here.

      if (results[0]) {  // Assuming the first result corresponds to new items
        results[0].forEach((newItem, index) => {
        const tempId = allNewItems[index].tempId;

    // Delete the temporary item
    this.dbService.delete('itinerary_item', tempId).pipe(
          // Once the delete is successful, add the new item
          switchMap(() => this.dbService.add('itinerary_item', newItem)),
          // After adding the new item to the database, dispatch the REPLACE_ITEM action
          tap(() => {
            this.store.dispatch(ItineraryActions.replaceItem({ tempId, newItem }));
          })
        ).subscribe();
      });
    }

      return [
        ItineraryActions.saveAllSuccess(),
        ItineraryActions.clearDeletedItems() // Action to clear deleted items from the state after they've been deleted
      ];
    }),
      catchError((error) => of(ItineraryActions.saveAllFailure({ error })))
    )
  );
}
function isExistingItineraryItem(item: any): item is ExistingItineraryItem {
  return 'id' in item && item.id !== undefined;
}
