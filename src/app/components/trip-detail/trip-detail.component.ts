import { Component, OnInit } from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import { Store } from '@ngrx/store';
import {AppState} from "../../store/app.state";

// import * as fromApp from '../store/app.reducer'; // Adjust this path as per your app structure
import * as fromTripStore from '../../store/trip';
import {fadeIn} from "../trip-dashboard/trip-dashboard.animation";
import {selectCurrentTrip} from "../../store/trip";
import {Trip} from "../../store";


@Component({
    selector: 'app-trip-details',
    templateUrl: './trip-detail.component.html',
    styleUrls: ['./trip-detail.component.scss'],
    animations: [fadeIn]
})
export class TripDetailComponent implements OnInit {
    isLoading$: Observable<boolean> = EMPTY;
    currentTrip$: Observable<Trip | null> = EMPTY; // Adjust the type as needed

    constructor(private store: Store<AppState>) {}

    ngOnInit(): void {
      // this.isLoading$ = this.store.select(fromTripStore.selectLoading); // Adjust as per your selectors
      // this.currentTrip$ = this.store.select(fromTripStore.selectCurrentTrip)
    }
}
