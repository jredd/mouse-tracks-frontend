import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ItineraryItem, Meal, Trip, TravelEvent, Break, Experience, Land} from "../../store";
import * as fromTripStore from "../../store/trip";
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app.state";
import { EMPTY, Observable } from "rxjs";
import { fadeIn } from "../trip-dashboard/trip-dashboard.animation";
import * as moment from 'moment';

interface locationGroup {
  name: string | null;
  display: boolean;
  itemGroups: itineraryItemGroup[];
}

interface itineraryItemGroup {
  header: string;
  land: Land | null;
  items: ItineraryItem[];
  type: string;
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
  isLoading$: Observable<boolean> = EMPTY;
  currentTrip$: Observable<Trip | null> = EMPTY;
  groupColumn1: itineraryItemGroup[];
  groupColumn2: itineraryItemGroup[];
  column1: locationGroup[];
  column2: locationGroup[];
  locationNames: string[];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromTripStore.selectLoading);
    this.groupItineraryByLocation(this.itineraryItems);
    this.currentTrip$ = this.store.select(fromTripStore.selectCurrentTrip);
  }

  ngAfterViewInit() {
    // this.finalList = this.groupAndOrderActivitiesByLand(this.itineraryItems);
    // this.isLoading$ = this.store.select(fromTripStore.selectLoading);
    // this.currentTrip$ = this.store.select(fromTripStore.selectCurrentTrip);
  }

  groupItineraryByLocation(itineraryItems: ItineraryItem[]): void {
    if (itineraryItems.length < 1) {
      return;
    }
    this.locationNames = [];
    const groups = []

    // Sort by activity_order
    const sortedItems = [...itineraryItems].sort((a, b) => a.activity_order - b.activity_order);

    let lastLand = null;
    for (const item of sortedItems) {
      const landName = this.getLandNameFromItem(item);
      console.log(landName)
      if (!['note', 'break', 'travelevent'].includes(item.content_type)) {
        if (lastLand !== landName) {
          const newGroup: itineraryItemGroup  = {
            header: landName,
            items: [item],
            type: 'activity',
            land: null
          }
          groups.push(newGroup);
        } else {
          groups[groups.length - 1].items.push(item)
        }
        lastLand = landName
      } else {
        let newGroup: itineraryItemGroup
        switch (item.content_type) {
          case 'note':
            newGroup = { header: 'Note', items: [item], type: 'note', land: null };
            break;
          case 'break':
            newGroup = { header: 'Break', items: [item], type: item.content_type, land: null };
            break;
          case 'travelevent':
            newGroup = { header: 'Travel Event', items: [item], type: item.content_type, land: null };
            break;
          default:
            newGroup = { header: 'Unknown Group', items: [item], type: item.content_type, land: null };
            break;
        }
        groups.push(newGroup);
        lastLand = item.content_type
      }
    }

    if (groups.length > 1 && itineraryItems.length > 8) {
      const middleIndex = Math.ceil(groups.length / 2);
      this.groupColumn1 = groups.slice(0, middleIndex);
      this.groupColumn2 = groups.slice(middleIndex);
    } else {
      this.groupColumn1 = groups
    }

    this.column1 = this.buildLocationGroups(this.groupColumn1)
    this.column2 = this.buildLocationGroups(this.groupColumn2)
  }

  buildLocationGroups(groupColumn: itineraryItemGroup[]): locationGroup[] {
    const column = []
    if (groupColumn) {
      let lastLocationName = null;
      for (const group of groupColumn) {
        if (group.type == 'activity') {
          let locationName: string;
          if (group.items[0].content_type == 'experience') {
            const activity = group.items[0].activity as Experience
            locationName = activity.locations[0].name
          } else {
            const activity = group.items[0].activity as Meal
            locationName = activity.meal_experience.locations[0].name
          }
          if (lastLocationName !== locationName) {
            let display = true;
            if (this.locationNames.includes(locationName)) {
              display = false;
            }
            const newLocation: locationGroup  = {
              name: locationName,
              itemGroups: [group],
              display
            }
            column.push(newLocation);
          } else {
            column[column.length - 1].itemGroups.push(group)
          }
          if (!this.locationNames.includes(locationName)) {
            this.locationNames.push(locationName);
          }
          lastLocationName = locationName
        }
        else {
          const newLocation: locationGroup  = {
            name: null,
            itemGroups: [group],
            display: false
          }
          column.push(newLocation);
        }
      }
    }
    return column
  }

  getLandNameFromItem(item: ItineraryItem): string {
    if (item.content_type === 'meal') {
      return (item.activity as Meal).meal_experience.land?.name || 'Unknown Land';
    } else if (item.activity && 'land' in item.activity) {
      console.log(item.activity)
      return item.activity.land?.name || 'Unknown Land';
    } else {
      return 'Unknown Land';
    }
  }

  getActivityName(item: ItineraryItem): string {
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

  getNoteInformation(item: itineraryItemGroup) {
    return item.items[0].notes
  }

  getTravelToFrom(item: itineraryItemGroup) {
    const activity = item.items[0].activity as TravelEvent
    return `${activity.from_location.name} -> ${activity.to_location.name}`
  }

  buildMealTitle(item: ItineraryItem) {
    const meal = item.activity as Meal;
    const capitalizedMealType = meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1);
    const timeString = item.start_time ? ` - ${moment(item.start_time, 'HH:mm').format('hh:mm A')}` : '';

    return `${capitalizedMealType}: ${meal.meal_experience.name}${timeString}`;

  }
}
