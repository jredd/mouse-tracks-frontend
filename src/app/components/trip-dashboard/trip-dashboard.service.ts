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
  ExistingItineraryItem, MealAPI
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
      tap((result: Trip[]) => this.dbService.bulkAdd('trip', result)),
      catchError(this.handleError<Trip[]>('getTrips', []))
    );
  }

  getTrip(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.BASE_URL}/trips/${id}/`).pipe(
      // map((trip: Trip) => ({
      //   ...trip,
      //   start_date: trip.start_date,
      //   end_date: new Date(trip.end_date),
      //   last_content_update: new Date(trip.last_content_update)
      // })),
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
      destination_id: trip.destination?.id,
      start_date: moment(trip.start_date).format('YYYY-MM-DD'),
      end_date: moment(trip.end_date).format('YYYY-MM-DD')
    };

    return this.http.put<Trip>(`${this.BASE_URL}/trips/${trip.id}/`, apiTrip).pipe(
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
    const tripId = items[0]?.trip.id; // Assuming all items belong to the same trip; adjust if this isn't the case.

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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private transformToAPIFormat(item: ItineraryItem): APIItineraryItem {
    let activity: any = { ...item.activity };

    switch (item.content_type) {
        case 'meal':
            if ('meal_experience' in activity) {
                delete (activity as any).meal_experience;
            }
            break;

        case 'travelevent':
            if (activity.from_location) {
                activity.from_location_id = activity.from_location.id;
                delete activity.from_location;
            }
            if (activity.to_location) {
                activity.to_location_id = activity.to_location.id;
                delete activity.to_location;
            }
            break;

        case 'break':
            if (activity.location) {
                activity.location_id = activity.location.id;
                delete activity.location;
            }
            break;
    }

    const apiItem: APIItineraryItem = {
        trip: item.trip.id,
        notes: item.notes,
        activity_order: item.activity_order,
        start_time: item.start_time,
        end_time: item.end_time,
        activity_id: item.activity_id,
        activity: activity, // Use the modified activity
        content_type: item.content_type,
        day: moment(item.day).format('YYYY-MM-DD')
    };

    if ('id' in item) {
        (apiItem as any).id = item.id; // Adding the id if it exists in the item.
    }

    return apiItem;
}

}
