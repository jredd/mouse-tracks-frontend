import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Trip, ItineraryItem, Break, TravelEvent, Meal } from './trip-dashboard.interfaces';
import {environment} from "../../../environments/environment";
import {dbConfig} from "../../db.config"; // Be sure to define these models

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
      tap((result: Trip) => this.dbService.update('trip', result)),
      catchError(this.handleError<Trip>('getTrip', {} as Trip))
    );
  }

  createTrip(trip: Partial<Trip>): Observable<Trip> {
    return this.http.post<Trip>(`${this.BASE_URL}/trips/`, trip).pipe(
      tap((newTrip: Trip) => this.dbService.add('trip', newTrip)),
      catchError(this.handleError<Trip>('createTrip'))
    );
  }

  updateTrip(id: string, trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.BASE_URL}/trips/${id}`, trip).pipe(
      tap((updatedTrip: Trip) => this.dbService.update('trip', updatedTrip)),
      catchError(this.handleError<Trip>('updateTrip'))
    );
  }

  getItineraryItems(tripId: number): Observable<ItineraryItem[]> {
    return this.http.get<ItineraryItem[]>(`${this.BASE_URL}/trips/${tripId}/itinerary-items/`).pipe(
      tap((result: ItineraryItem[]) => this.dbService.bulkAdd('itinerary-item', result)),
      catchError(this.handleError<ItineraryItem[]>('getItineraryItems', []))
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
      tap((result: TravelEvent) => this.dbService.update('travel-event', result)),
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
