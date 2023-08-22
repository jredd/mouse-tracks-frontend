import { Component, Input, OnInit } from '@angular/core';
import {ItineraryItem, Trip} from "../../store";
import * as fromTripStore from "../../store/trip";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.state";
import {EMPTY, Observable} from "rxjs";
import {fadeIn} from "../trip-dashboard/trip-dashboard.animation";

interface LandGroup {
  landName: string;
  activities: ItineraryItem[];
}

interface LocationGroup {
  locationName: string;
  lands: LandGroup[];
}

@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.scss'],
  animations: [fadeIn],
})
export class DayDetailComponent implements OnInit {
  @Input() day: string;
  @Input() itineraryItems: ItineraryItem[];
  locationGroups: LocationGroup[] = [];
  isLoading$: Observable<boolean> = EMPTY;
  currentTrip$: Observable<Trip | null> = EMPTY; //

  constructor(private store: Store<AppState>) {
  }
  ngOnInit() {
    this.groupItineraryByLocationAndLand(this.itineraryItems);
    this.isLoading$ = this.store.select(fromTripStore.selectLoading); // Adjust as per your selectors
    this.currentTrip$ = this.store.select(fromTripStore.selectCurrentTrip)
    console.log(this.day)
  }

  private createOrFindLandGroup(lands: LandGroup[], landName: string): LandGroup {
    let landGroup = lands.find(group => group.landName === landName);
    if (!landGroup) {
      landGroup = {
        landName,
        activities: []
      };
      lands.push(landGroup);
    }
    return landGroup;
  }

  private createOrFindLocationGroup(locationName: string): LocationGroup {
    let locationGroup = this.locationGroups.find(group => group.locationName === locationName);
    if (!locationGroup) {
      locationGroup = {
        locationName,
        lands: []
      };
      this.locationGroups.push(locationGroup);
    }
    return locationGroup;
  }

  groupItineraryByLocationAndLand(itineraryItems: ItineraryItem[]): void {
    for (const item of itineraryItems) {
      const locationName = item.activity.locations[0]?.name || 'Unknown Location';

      // Find or create the location group
      const locationGroup = this.createOrFindLocationGroup(locationName);

      if (item.activity.land) {
        const landName = item.activity.land.name || 'Unknown Land';
        const landGroup = this.createOrFindLandGroup(locationGroup.lands, landName);

        landGroup.activities.push(item);
      } else {
        // If no land, just add to the location (you might want to handle this differently)
        const defaultGroup = this.createOrFindLandGroup(locationGroup.lands, 'Default');
        defaultGroup.activities.push(item);
      }
    }
  }
}
