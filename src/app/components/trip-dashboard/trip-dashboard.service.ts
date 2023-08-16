import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {forkJoin, Observable, of} from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';
import * as moment from 'moment';

import {
  Trip,
  ItineraryItem,
  Break,
  TravelEvent,
  Meal,
  ApiTrip,
  APIItineraryItem,
  Experience,
  ExistingItineraryItem
} from '../../store/';
import { environment } from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly BASE_URL = `${environment.apiBaseUrl}/trips`;

  constructor(private http: HttpClient, private dbService: NgxIndexedDBService) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.BASE_URL}/trips/`).pipe(
      map((trips: Trip[]) => trips.map(trip => ({
        ...trip,
        start_date: new Date(trip.start_date),
        end_date: new Date(trip.end_date)
      }))),
      tap((result: Trip[]) => this.dbService.bulkAdd('trip', result)),
      catchError(this.handleError<Trip[]>('getTrips', []))
    );
  }

  getTrip(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.BASE_URL}/trips/${id}/`).pipe(
      map((trip: Trip) => ({
        ...trip,
        start_date: new Date(trip.start_date),
        end_date: new Date(trip.end_date),
        last_content_update: new Date(trip.last_content_update)
      })),
      tap((result: Trip) => this.dbService.update('trip', result)),
      catchError(this.handleError<Trip>('getTrip', {} as Trip))
    );
  }

  createTrip(trip: Partial<Trip>): Observable<Trip> {
    const apiTrip: ApiTrip = {
      ...trip,
      start_date: moment(trip.start_date).format('YYYY-MM-DD'),
      end_date: moment(trip.end_date).format('YYYY-MM-DD')
    };

    return this.http.post<Trip>(`${this.BASE_URL}/trips/`, apiTrip).pipe(
      tap((newTrip: Trip) => this.dbService.add('trip', newTrip)),
      catchError(this.handleError<Trip>('createTrip'))
    );
  }

  updateTrip(trip: Partial<Trip>): Observable<Trip> {
    const apiTrip: ApiTrip = {
      ...trip,
      start_date: moment(trip.start_date).format('YYYY-MM-DD'),
      end_date: moment(trip.end_date).format('YYYY-MM-DD')
    };

    return this.http.put<Trip>(`${this.BASE_URL}/trips/${trip.id}`, apiTrip).pipe(
      tap((updatedTrip: Trip) => this.dbService.update('trip', updatedTrip)),
      catchError(this.handleError<Trip>('updateTrip'))
    );
  }

  // Existing function to get itinerary items by tripId
  getItineraryItems(tripId: string): Observable<ItineraryItem[]> {
    return this.http.get<ItineraryItem[]>(`${this.BASE_URL}/trips/${tripId}/itinerary-items/`).pipe(
      tap((result: ItineraryItem[]) => this.dbService.bulkAdd('itinerary_item', result)),
      catchError(this.handleError<ItineraryItem[]>('getItineraryItems', []))
    );
  }
  private transformToAPIFormat(item: ItineraryItem): APIItineraryItem {
      const apiItem: APIItineraryItem = {
          trip: item.trip,
          notes: item.notes,
          activity_order: item.activity_order,
          start_time: item.start_time,
          end_time: item.end_time,
          activity_id: item.activity_id,
          activity: item.activity,
          activity_content_type: 'experience',
          day: moment(item.day).format('YYYY-MM-DD')
      };

      if ('id' in item) {
        (apiItem as any).id = item.id; // Adding the id if it exists in the item.
      }

      return apiItem
  }

  // Function to create a new itinerary item for a specific trip
  createItineraryItem(tripId: string, item: ItineraryItem): Observable<ItineraryItem> {
    let apiItem: APIItineraryItem;
    apiItem = this.transformToAPIFormat(item)


    return this.http.post<ItineraryItem>(`${this.BASE_URL}/trips/${tripId}/itinerary-items/`, apiItem).pipe(
      tap((result: ItineraryItem) => this.dbService.add('itinerary_item', result)),
      catchError(this.handleError<ItineraryItem>('createItineraryItem'))
    );
  }

  bulkSaveItineraryItems(items: ItineraryItem[]): Observable<ItineraryItem[]> {
    const transformedItems = items.map(item => this.transformToAPIFormat(item));
    const tripId = items[0]?.trip; // Assuming all items belong to the same trip; adjust if this isn't the case.

    return this.http.post<ItineraryItem[]>(`${this.BASE_URL}/trips/${tripId}/itinerary-items-bulk/`, transformedItems).pipe(
        tap(results => results.forEach(result => this.dbService.add('itinerary_item', result))),
        catchError(this.handleError<ItineraryItem[]>('bulkSaveItineraryItems'))
    );
  }

  bulkUpdateItineraryItems(items: ExistingItineraryItem[]): Observable<ItineraryItem[]> {
    const transformedItems = items.map(item => this.transformToAPIFormat(item));
    const tripId = items[0]?.trip; // Again, assuming all items belong to the same trip.

    return this.http.put<ItineraryItem[]>(`${this.BASE_URL}/trips/${tripId}/itinerary-items-bulk/`, transformedItems).pipe(
        tap(results => results.forEach(result => this.dbService.add('itinerary_item', result))),
        catchError(this.handleError<ItineraryItem[]>('bulkUpdateItineraryItems'))
    );
  }

  bulkDeleteItineraryItems(items: ExistingItineraryItem[]): Observable<void> {
    const idsToDelete = items.map(item => item.id);
    const tripId = items[0]?.trip; // Again, assuming all items belong to the same trip.

    return this.http.request<void>('DELETE', `${this.BASE_URL}/trips/${tripId}/itinerary-items-bulk/`, {
        body: idsToDelete
    }).pipe(
        tap(() => idsToDelete.forEach(id => this.dbService.delete('itinerary_item', id))),
        catchError(this.handleError<void>('bulkDeleteItineraryItems'))
    );
  }




  // Function to update an existing itinerary item by its id
  updateItineraryItem(itemId: string, item: ItineraryItem): Observable<ItineraryItem> {
    return this.http.put<ItineraryItem>(`${this.BASE_URL}/itinerary-items/${itemId}/`, item).pipe(
      tap((result: ItineraryItem) => this.dbService.update('itinerary_item', result)),
      catchError(this.handleError<ItineraryItem>('updateItineraryItem'))
    );
  }

  // bulkSaveItineraryItems(items: ItineraryItem[]): Observable<ItineraryItem[]> {
  //   console.log("gonna bulk")
  //   // Using RxJS's forkJoin to execute multiple requests in parallel.
  //   // forkJoin will wait for all of the observables to complete and then emit an array of the results.
  //   return forkJoin(
  //     items.map(item => this.createItineraryItem(item.trip, item))
  //   ).pipe(
  //     // (Optional) If you need to do something with the result array, you can use the map operator.
  //     map(results => {
  //       // Do any processing with results if needed.
  //       return results;
  //     }),
  //     catchError(this.handleError<ItineraryItem[]>('bulkSaveItineraryItems'))
  //   );
  // }
  //
  // bulkUpdateItineraryItems(items: ExistingItineraryItem[]): Observable<ItineraryItem[]> {
  //   // Map over each existing itinerary item and call the putItineraryItem service method
  //   const updateTasks = items.map(item => this.putItineraryItem(item.id, item));
  //
  //   // Use forkJoin to execute the put requests in parallel
  //   return forkJoin(updateTasks).pipe(
  //     map(results => {
  //       // If additional processing of results is required, do it here.
  //       // For now, simply return the results.
  //       return results;
  //     }),
  //     catchError(this.handleError<ItineraryItem[]>('bulkUpdateItineraryItems'))
  //   );
  // }


  // Function to partially update an existing itinerary item by its id
  putItineraryItem(itemId: string, item: Partial<ItineraryItem>): Observable<ItineraryItem> {
    return this.http.put<ItineraryItem>(`${this.BASE_URL}/itinerary-items/${itemId}/`, item).pipe(
      tap((result: ItineraryItem) => this.dbService.update('itinerary_item', result)),
      catchError(this.handleError<ItineraryItem>('patchItineraryItem'))
    );
  }

  // Function to delete an itinerary item by its id
  deleteItineraryItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/itinerary-items/${itemId}/`).pipe(
      tap(() => this.dbService.delete('itinerary_item', itemId)),
      catchError(this.handleError('deleteItineraryItem'))
    );
  }

  getBreak(itineraryItemId: number, breakId: number): Observable<Break> {
    return this.http.get<Break>(`${this.BASE_URL}/itinerary-items/${itineraryItemId}/breaks/${breakId}/`).pipe(
      tap((result: Break) => this.dbService.update('break', result)),
      catchError(this.handleError<Break>('getBreak', {} as Break))
    );
  }

  getTravelEvent(itineraryItemId: number, eventId: number): Observable<TravelEvent> {
    return this.http.get<TravelEvent>(`${this.BASE_URL}/itinerary-items/${itineraryItemId}/travel-events/${eventId}/`).pipe(
      tap((result: TravelEvent) => this.dbService.update('travel_event', result)),
      catchError(this.handleError<TravelEvent>('getTravelEvent', {} as TravelEvent))
    );
  }

  getMeal(itineraryItemId: number, mealId: number): Observable<Meal> {
    return this.http.get<Meal>(`${this.BASE_URL}/itinerary-items/${itineraryItemId}/meals/${mealId}/`).pipe(
      tap((result: Meal) => this.dbService.update('meal', result)),
      catchError(this.handleError<Meal>('getMeal', {} as Meal))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
