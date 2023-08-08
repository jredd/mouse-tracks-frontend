import { Component, OnInit } from '@angular/core';
import {MatButtonToggleChange} from "@angular/material/button-toggle";
import {TripService} from "../trip-dashboard/trip-dashboard.service";
import { AppService } from "../../app.service";
import {Destination, Location} from "../../store";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../store/app.state";
import * as fromLocationStore from '../../store/location/';
import * as fromTripStore from '../../store/trip/';
import {EMPTY, Observable, take} from "rxjs";


@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {
  experienceTypes = ["Attractions", "Entertainment", "Event"]
  // locations$: Observable<Location[]> = EMPTY;  // Declare locations array
  locations$: Observable<Location[]> = this.store.pipe(select(fromLocationStore.selectAllLocations));

  constructor(private store: Store<AppState>,) {}  // Inject TripService

  ngOnInit() {
    this.store.pipe(
    select(fromTripStore.selectCurrentTrip),
      take(1)
    ).subscribe(currentTrip => {
      if (currentTrip && currentTrip.destination.id) {
        this.store.dispatch(fromLocationStore.loadLocations({ destId: currentTrip.destination.id }));
      }
    });

  }

  onExperienceTypeChange(event: MatButtonToggleChange) {
    console.log(event.value); // prints the selected experience type
  }
}
