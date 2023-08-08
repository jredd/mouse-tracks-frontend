import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import {loadTrips, selectAllTrips, selectLoading, selectTrips} from "../../store/trip";
import { AppState } from "../../store/app.state";
import { Trip } from "../../store";
import { tap } from 'rxjs/operators';
import { map, filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import {selectAllDestinations} from "../../store/destination";

@Component({
  selector: 'app-trip-dashboard',
  templateUrl: './trip-dashboard.component.html',
  styleUrls: ['./trip-dashboard.component.scss']
})
export class TripDashboardComponent implements OnInit {
  loading$: Observable<boolean> = EMPTY;
  trips$: Observable<Trip[]> = EMPTY;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {}
  ngAfterInit() {

  }
  ngOnInit() {
    // Dispatch the action to load the trips
    this.store.dispatch(loadTrips());
    this.loading$ = this.store.select(selectLoading);
    this.trips$ = this.store.select(selectAllTrips)
  }
}
