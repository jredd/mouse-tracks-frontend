import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { ItineraryItem, Meal, Trip, TravelEvent, Break, Experience } from "../../store";
import * as fromTripStore from "../../store/trip";
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app.state";
import { EMPTY, Observable } from "rxjs";
import { fadeIn } from "../trip-dashboard/trip-dashboard.animation";

interface LandGroup {
  landName: string;
  activities: ItineraryItem[];
}

interface FinalItem {
  type: 'landGroup' | 'activity' | 'noteGroup';
  data: any;
}

interface itineraryItemGroup {
  header: string;
  items: ItineraryItem[];
}


@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.scss'],
  animations: [fadeIn],
})
export class DayDetailComponent implements AfterViewInit, OnInit {
  @Input() day: string;
  @Input() itineraryItems: ItineraryItem[];
  finalList: FinalItem[] = [];
  isLoading$: Observable<boolean> = EMPTY;
  currentTrip$: Observable<Trip | null> = EMPTY;
  groupColumn1: itineraryItemGroup[];
  groupColumn2: itineraryItemGroup[];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromTripStore.selectLoading);
    this.groupItineraryByLocation(this.itineraryItems);
    this.currentTrip$ = this.store.select(fromTripStore.selectCurrentTrip);
  }

  ngAfterViewInit() {
    console.log('day detail after init')
    // this.finalList = this.groupAndOrderActivitiesByLand(this.itineraryItems);
    // this.isLoading$ = this.store.select(fromTripStore.selectLoading);
    // this.currentTrip$ = this.store.select(fromTripStore.selectCurrentTrip);
  }

  groupItineraryByLocation(itineraryItems: ItineraryItem[]): void {
    // this.itineraryItemGroups = [];
    const groups = []

    // Sort by activity_order
    const sortedItems = [...itineraryItems].sort((a, b) => a.activity_order - b.activity_order);

    let lastLand = null;
    for (const item of sortedItems) {
      const landName = this.getLandNameFromItem(item);

      if (!['note', 'break', 'travelevent'].includes(item.content_type)) {
        if (lastLand !== landName) {
          const newGroup = {header: landName, items: [item]}
          groups.push(newGroup);
        } else {
          groups[groups.length - 1].items.push(item)
        }
        lastLand = landName
      } else {
        const newGroup = {header: item.content_type, items: [item]}
        groups.push(newGroup);
        lastLand = item.content_type
      }
    }

    if (groups.length > 1) {
      const middleIndex = Math.ceil(groups.length / 2);
      this.groupColumn1 = groups.slice(0, middleIndex);
      this.groupColumn2 = groups.slice(middleIndex);
    } else {
      this.groupColumn1 = groups
    }
  }

  getLandNameFromItem(item: ItineraryItem): string {
    if (item.content_type === 'meal') {
      return (item.activity as Meal).meal_experience.land?.name || 'Unknown Land';
    } else if (item.activity && 'land' in item.activity) {
      return item.activity.land?.name || 'Unknown Land';
    } else {
      return 'Unknown Land';
    }
  }

  getActivityName(item: ItineraryItem): string {
    // console.log(item.content_type)
    if (item.content_type === 'meal') {
      return (item.activity as Meal).meal_experience.name;
    } else if (item.content_type === 'travelevent') {
      return `Travel: From ${ (item.activity as TravelEvent).from_location } to ${ (item.activity as TravelEvent).to_location }`;
    } else if (item.content_type === 'break') {
      return `Break: At ${ (item.activity as Break).location }`;
    } else if (item.content_type === 'experience') {
      return `${(item.activity as Experience).name}`;
    } else if (item.content_type === 'note') {
      return `Note: ${ item.notes }`;
    } else {
      return 'Unknown Activity';
    }
  }
}
