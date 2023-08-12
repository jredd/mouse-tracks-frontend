import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { EMPTY, Observable, take } from "rxjs";

import { Location} from "../../store";
import { select, Store} from "@ngrx/store";
import { AppState } from "../../store/app.state";
import * as fromLocationStore from '../../store/location/';
import * as fromTripStore from '../../store/trip/';
import * as fromExperienceStore from '../../store/experience/';


@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {
  experienceTypes = ["Attractions", "Entertainment", "Event", "Restaurant"]
  currentTypeExperiences$: Observable<string> = EMPTY;  // Declare locations array
  locations$: Observable<Location[]> = this.store.pipe(select(fromLocationStore.selectAllLocations));

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(
    select(fromTripStore.selectCurrentTrip),
      take(1)
    ).subscribe(currentTrip => {
      if (currentTrip && currentTrip.destination.id) {
        this.store.dispatch(fromLocationStore.loadLocations({ dest_id: currentTrip.destination.id }));
      }
    });
    this.currentTypeExperiences$ = this.store.select(fromExperienceStore.selectCurrentExperienceType);
  }

  onLocationChange(locId: string) {
    console.log('Location:', locId)
    this.store.dispatch(fromExperienceStore.loadExperiences({ loc_id: locId }));
  }
  onExperienceTypeChange(event: MatButtonToggleChange) {
    this.store.dispatch(fromExperienceStore.setCurrentExperienceType({ experienceType: event.value.toLowerCase() }));
  }
}
