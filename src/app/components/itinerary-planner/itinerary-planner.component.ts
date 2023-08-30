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
import { fadeIn } from "../trip-dashboard/trip-dashboard.animation";
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DialoguePlannerContentComponent } from "../dialogue-planner-content/dialogue-planner-content.component";
import {FormType} from "../dialogue-planner-content/dialogue-planner-content.interface";


@Component({
  selector: 'app-itinerary-planner',
  templateUrl: './itinerary-planner.component.html',
  styleUrls: ['./itinerary-planner.component.scss'],
  animations: [fadeIn],
})
export class ItineraryPlannerComponent implements OnInit {
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

  constructor(public dialogue: MatDialog, private store: Store<AppState>, private cdr: ChangeDetectorRef) {}

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
      if (locations && locations.length > 0) {
        this.onLocationChange(locations[0].id)
      }
    })
    this.updateExperienceTypes()
  }

  openDialog(formType: FormType, dialogTitle: string, height: string, autofocus = true) {
    this.dialogue.open(DialoguePlannerContentComponent, {
      width: '600px',
      height: height,
      data: { type: formType, title: dialogTitle },
      autoFocus: autofocus
    });
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
    this.locId = locId
    this.store.dispatch(fromExperienceStore.loadExperiences({ loc_id: locId }));
  }
  onExperienceTypeChange(event: MatButtonToggleChange) {
    this.store.dispatch(fromExperienceStore.setCurrentExperienceType({ experienceType: event.value.toLowerCase() }));
  }

  onAddNotes() {
    this.openDialog(FormType.NOTES, "Add Note", '350px');
  }

  onTravelEvents() {
    this.openDialog(FormType.TRAVEL_EVENT, "Add Travel", '600px', false);
  }

  onAddBreak() {
    this.openDialog(FormType.BREAK, "Add Break", '350px');
  }

  onSave() {
    // Assuming you have an array of itinerary items named 'itineraryItems' and a tripId variable.
    this.store.dispatch(fromItineraryItemStore.saveAllNonEmptyDays());
  }
}
