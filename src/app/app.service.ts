// app.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Destination, Location, Land, Experience } from './app.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly BASE_URL = `${environment.apiBaseUrl}/destinations`;

  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService
  ) { }

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.BASE_URL}/destinations/`).pipe(
      tap((result: Destination[]) => this.dbService.bulkAdd('destination', result)),
      catchError(this.handleError<Destination[]>('getDestinations', []))
    );
  }

  getDestination(destId: string): Observable<Destination> {
    return this.http.get<Destination>(`${this.BASE_URL}/destinations/${destId}/`).pipe(
      tap((result: Destination) => this.dbService.update('destination', result)),
      catchError(this.handleError<Destination>('getDestination', {} as Destination))
    );
  }

  getLocations(destId: string): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.BASE_URL}/destinations/${destId}/locations/`).pipe(
      tap((result: Location[]) => this.dbService.bulkAdd('location', result)),
      catchError(this.handleError<Location[]>('getLocations', []))
    );
  }

  getLocation(destId: string, locId: string): Observable<Location> {
    return this.http.get<Location>(`${this.BASE_URL}/destinations/${destId}/locations/${locId}/`).pipe(
      tap((result: Location) => this.dbService.update('location', result)),
      catchError(this.handleError<Location>('getLocation', {} as Location))
    );
  }

  getLands(locId: string): Observable<Land[]> {
    return this.http.get<Land[]>(`${this.BASE_URL}/locations/${locId}/lands/`).pipe(
      tap((result: Land[]) => this.dbService.bulkAdd('land', result)),
      catchError(this.handleError<Land[]>('getLands', []))
    );
  }

  getLand(locId: string, landId: string): Observable<Land> {
    return this.http.get<Land>(`${this.BASE_URL}/locations/${locId}/lands/${landId}/`).pipe(
      tap((result: Land) => this.dbService.update('land', result)),
      catchError(this.handleError<Land>('getLand', {} as Land))
    );
  }

  getExperiences(locId: string): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.BASE_URL}/locations/${locId}/experiences/`).pipe(
      tap((result: Experience[]) => this.dbService.bulkAdd('experience', result)),
      catchError(this.handleError<Experience[]>('getExperiences', []))
    );
  }

  getExperience(locId: string, expId: string): Observable<Experience> {
    return this.http.get<Experience>(`${this.BASE_URL}/locations/${locId}/experiences/${expId}/`).pipe(
      tap((result: Experience) => this.dbService.update('experience', result)),
      catchError(this.handleError<Experience>('getExperience', {} as Experience))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error('Server error:', error);
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
      } else {
        console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      }
      // Return an empty result to keep the app running
      return of(result as T);
    };
  }

}
