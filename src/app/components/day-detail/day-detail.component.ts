import { Component, Input, OnInit } from '@angular/core';
import {ItineraryItem, Meal, Trip, TravelEvent, Break, Experience} from "../../store";
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
    console.log('herp', landGroup)
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
    console.log(locationGroup)
    return locationGroup;
  }

  groupItineraryByLocationAndLand(itineraryItems: ItineraryItem[]): void {
    for (const item of itineraryItems) {
      let locationName = 'Unknown Location';

      switch (item.content_type) {
        case 'meal':
          locationName = (item.activity as Meal).meal_experience.locations[0]?.name || 'Unknown Location';
          break;
        case 'travelevent':
          locationName = (item.activity as TravelEvent).from_location || 'Unknown Location';
          break;
        case 'break':
          locationName = (item.activity as Break).location || 'Unknown Location';
          break;
        case 'experience':
          locationName = (item.activity as Experience).locations[0]?.name || 'Unknown Location';
          break;
        case 'note':
          locationName = 'Notes';
          break;
        default:
          locationName = 'Unknown Location';
      }

      // Find or create the location group
      const locationGroup = this.createOrFindLocationGroup(locationName);

      // Create land group
      let landName = 'Unknown Land';
      if (item.content_type !== 'note') {
        if (item.activity && 'land' in item.activity) {
          landName = item.activity.land?.name || 'Unknown Land';
        }
      } else {
        landName = 'Notes';
      }

      const landGroup = this.createOrFindLandGroup(locationGroup.lands, landName);
      landGroup.activities.push(item);
    }
}

  getActivityName(item: ItineraryItem): string {
    console.log(item.content_type)
    if (item.content_type === 'meal') {
      return (item.activity as Meal).meal_experience.name;
    } else if (item.content_type === 'travelevent') {
      return `Travel: From ${ (item.activity as TravelEvent).from_location } to ${ (item.activity as TravelEvent).to_location }`;
    } else if (item.content_type === 'break') {
      return `Break: At ${ (item.activity as Break).location }`;
    } else if (item.content_type === 'experience') {
      return `Experience: ${(item.activity as Experience).name}`;
    } else if (item.content_type === 'note') {
      return `Note: ${ item.notes }`;
    } else {
      return 'Unknown Activity';
    }
  }


}
