import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { EMPTY, Observable, take } from "rxjs";

import {Experience, Location, UIExperienceTypes} from "../../store";
import { select, Store} from "@ngrx/store";
import { AppState } from "../../store/app.state";
import * as fromLocationStore from '../../store/location/';
import * as fromTripStore from '../../store/trip/';
import * as fromExperienceStore from '../../store/experience/';
import * as fromItineraryItemStore from '../../store/itinerary-item/';
import {fadeIn} from "../trip-dashboard/trip-dashboard.animation";
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
  animations: [fadeIn],
})
export class ItineraryComponent implements OnInit {
  // experienceTypes = ["Attraction", "Entertainment", "Event", "Restaurant"]
  experienceTypes: string[] = [];
  days$: Observable<string[]> = this.store.pipe(
    select(fromItineraryItemStore.selectDays)
  );
  currentDay$: Observable<string> = this.store.pipe(select(fromItineraryItemStore.selectTheCurrentDay));
  currentTypeExperiences$: Observable<string> = EMPTY;  // Declare locations array
  experiencesByType$: Observable<{
    attractions: Experience[];
    restaurants: Experience[];
    entertainment: Experience[];
    events: Experience[];
  }> = EMPTY;  // Declare locations array
  locations$: Observable<Location[]> = this.store.pipe(select(fromLocationStore.selectAllLocations));
  locId: string = "";
  defaultExperienceType: string = '';
  selectedDay: string = '';


  // Define this mapping at the top-level of your component, outside any methods.
  private experienceTypeMapping: Record<string, UIExperienceTypes> = {
    'Attractions': 'attractions',
    'Entertainment': 'entertainment',
    'Events': 'events',
    'Restaurants': 'restaurants'
  };

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // this.currentTypeExperiences$.subscribe(type => this.currentExperienceType = type);
    this.store.pipe(
    select(fromTripStore.selectCurrentTrip),
      take(1)
    ).subscribe(currentTrip => {
      if (currentTrip && currentTrip.destination.id) {
        this.store.dispatch(fromLocationStore.loadLocations({ dest_id: currentTrip.destination.id }));
        this.store.dispatch(fromItineraryItemStore.getItineraryItemsRequest({ trip_id: currentTrip.id }));
      }
    });
    this.currentTypeExperiences$ = this.store.select(fromExperienceStore.selectCurrentExperienceType);
    this.experiencesByType$ = this.store.pipe(select(fromExperienceStore.selectCurrentExperiencesByType))
    this.currentDay$.subscribe(currentDay => {
      this.selectedDay = currentDay
    })
    this.locations$.subscribe(locations => {
      console.log(locations)
      if (locations && locations.length > 0) {
        this.onLocationChange(locations[0].id)
      }
    })
    this.updateExperienceTypes()
  }

  onDayChange(selectedDay: string) {
    this.store.dispatch(fromItineraryItemStore.setCurrentDay({ day: selectedDay }));
  }


  updateExperienceTypes() {
    this.experiencesByType$.subscribe(data => {
      this.experienceTypes = [];

      if (data.attractions && data.attractions.length) {
        this.experienceTypes.push('Attractions');
      }

      if (data.entertainment && data.entertainment.length) {
        this.experienceTypes.push('Entertainment');
      }

      if (data.events && data.events.length) {
        this.experienceTypes.push('Events');
      }

      if (data.restaurants && data.restaurants.length) {
        this.experienceTypes.push('Restaurants');
      }

      // Set the default currentExperienceTypeSelection based on the updated experienceTypes
      if (this.experienceTypes.length) {
        this.defaultExperienceType = this.experienceTypes[0].toLowerCase()
      }
    });
  }

  onLocationChange(locId: string) {
    console.log('Location:', locId)
    this.locId = locId
    this.store.dispatch(fromExperienceStore.loadExperiences({ loc_id: locId }));
  }
  onExperienceTypeChange(event: MatButtonToggleChange) {
    console.log(event)
    // if event
    this.store.dispatch(fromExperienceStore.setCurrentExperienceType({ experienceType: event.value.toLowerCase() }));
  }

  onAddNotes() {
    // Logic to handle adding notes goes here.
  }

  onTravelEvents() {
      // Logic to handle travel events goes here.
  }

  onAddBreak() {
    // Logic to handle breaks go here.
  }

  onSave() {
    console.log("save dat shit")
    // Assuming you have an array of itinerary items named 'itineraryItems' and a tripId variable.
    this.store.dispatch(fromItineraryItemStore.saveAllNonEmptyDays());
  }
}
