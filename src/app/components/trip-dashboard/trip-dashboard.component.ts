import {Component, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import {EMPTY, Observable, Subject, takeUntil} from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AppState } from "../../store/app.state";
import { loadTrips, selectAllTrips, selectLoading } from "../../store/trip";
import { Trip } from "../../store";
import { staggeredFadeIn } from "./trip-dashboard.animation";


@Component({
  selector: 'app-trip-dashboard',
  templateUrl: './trip-dashboard.component.html',
  styleUrls: ['./trip-dashboard.component.scss'],
  animations: [staggeredFadeIn],
})
export class TripDashboardComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean> = EMPTY;
  trips$: Observable<Trip[]> = EMPTY;
  displayTrips = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, private router: Router) {}
  ngAfterInit() {

  }
  ngOnInit() {
    // Dispatch the action to load the trips
    this.store.dispatch(loadTrips());
    this.loading$ = this.store.select(selectLoading);
    this.trips$ = this.store.select(selectAllTrips)
    this.animateTrips(); // Call this for the initial animation

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => {
      this.animateTrips();
    });
  }

  animateTrips() {
    this.displayTrips = false;
    setTimeout(() => this.displayTrips = true, 100);
  }

  ngOnDestroy() {
    // console.log('Destroy TripDashboardComponent');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
