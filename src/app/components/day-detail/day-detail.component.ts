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

// interface itineraryItemGroup {
//   header: string;
//   land: Land | null;
//   items: ItineraryItem[];
//   type: string;
// }

interface landItemGroup {
  name: string | null;
  items: ItineraryItem[];
}

interface itineraryItemGroup {
  header: string;
  items: ItineraryItem[];
  landItems: landItemGroup[];
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
    this.groupItineraryItemsByLocation(this.itineraryItems);
    this.currentTrip$ = this.store.select(fromTripStore.selectCurrentTrip);
  }

  ngAfterViewInit() {
    // this.finalList = this.groupAndOrderActivitiesByLand(this.itineraryItems);
    // this.isLoading$ = this.store.select(fromTripStore.selectLoading);
    // this.currentTrip$ = this.store.select(fromTripStore.selectCurrentTrip);
  }

  // groupItineraryByLocationOriginal(itineraryItems: ItineraryItem[]): void {
  //   if (itineraryItems.length < 1) {
  //     return;
  //   }
  //   this.locationNames = [];
  //   const groups = []
  //   const sortedItems = [...itineraryItems].sort((a, b) => a.activity_order - b.activity_order);
  //
  //   let lastLand = null;
  //   for (const item of sortedItems) {
  //     // console.log('item:', item)
  //     if (item.content_type === 'break') {
  //       console.log(item)
  //     }
  //     const landName = this.getLandNameFromItem(item);
  //     // console.log(item.content_type)
  //     // console.log((item.content_type != 'note' && groups.length == 0))
  //     if (!['note', 'break', 'travelevent'].includes(item.content_type)) {
  //       if (lastLand !== landName) {
  //         const newGroup: itineraryItemGroup  = {
  //           header: landName,
  //           items: [item],
  //           type: 'activity',
  //           land: null
  //         }
  //         groups.push(newGroup);
  //       } else {
  //         // console.log("groups", groups, item)
  //         groups[groups.length - 1].items.push(item)
  //       }
  //       if (item.content_type != 'note') {
  //        lastLand = landName
  //       }
  //     } else {
  //       let newGroup: itineraryItemGroup
  //       // console.log('herp:', item.content_type)
  //       switch (item.content_type) {
  //         case 'note':
  //           newGroup = { header: 'Note', items: [item], type: 'note', land: null };
  //           break;
  //         case 'break':
  //           newGroup = { header: 'Break', items: [item], type: item.content_type, land: null };
  //           break;
  //         case 'travelevent':
  //           newGroup = { header: 'Travel Event', items: [item], type: item.content_type, land: null };
  //           break;
  //         default:
  //           newGroup = { header: 'Unknown Group', items: [item], type: item.content_type, land: null };
  //           break;
  //       }
  //       groups.push(newGroup);
  //       lastLand = item.content_type
  //     }
  //   }
  //
  //   if (groups.length > 1 && itineraryItems.length > 7) {
  //     const middleIndex = Math.ceil(groups.length / 2);
  //     this.groupColumn1 = groups.slice(0, middleIndex);
  //     this.groupColumn2 = groups.slice(middleIndex);
  //   } else {
  //     this.groupColumn1 = groups
  //   }
  //
  //   // console.log('column1:', this.column1, 'column2:', this.groupColumn2)
  //   this.column1 = this.buildLocationGroups(this.groupColumn1)
  //   this.column2 = this.buildLocationGroups(this.groupColumn2)
  //   // console.log('group1:', this.groupColumn1, 'group2:', this.groupColumn2)
  // }

  createGroup(header: string, item: ItineraryItem, type: string): itineraryItemGroup {
    return {
      header: header,
      items: [item],
      type: type,
      landItems: [],
    };
  }

  groupItineraryItemsByLocation(itineraryItems: ItineraryItem[]): void {
    if (itineraryItems.length < 1) {
      return;
    }
    this.locationNames = [];
    const locations: itineraryItemGroup[] = []
    const sortedItems = [...itineraryItems].sort((a, b) => a.activity_order - b.activity_order);

    let lastLocationId: string = ''
    for (const item of sortedItems) {
      switch (item.content_type) {
        case 'note':
          if (lastLocationId == '') {
            locations.push(this.createGroup('Note', item, 'note'))
          } else {
            let lastLocationGroup = locations[locations.length - 1];
            lastLocationGroup.items.push(item)
          }
          break;
        case 'break':
          let breakActivity = item.activity as Break
          if (lastLocationId != breakActivity.location.id) {
            locations.push(this.createGroup(breakActivity.location.name, item, 'break'))
          } else {
            let lastLocationGroup = locations[locations.length - 1];
            lastLocationGroup.items.push(item)
          }
          lastLocationId = breakActivity.location.id
          break;
        case 'travelevent':
          let travelActivity = item.activity as TravelEvent
          locations.push(this.createGroup(travelActivity.travel_type, item, 'travelevent'))
          lastLocationId = ''
          break;
        case 'meal':
          let experienceMeal = item.activity as Meal
          if (lastLocationId != experienceMeal.meal_experience.locations[0].id) {
            locations.push(this.createGroup(experienceMeal.meal_experience.locations[0].name, item, 'activity'))
          } else {
            let lastLocationGroup = locations[locations.length - 1];
            lastLocationGroup.items.push(item)
          }
          lastLocationId = experienceMeal.meal_experience.locations[0].id
          break;
        default:
          // Default is just the Experience type
          let experienceActivity = item.activity as Experience
          if (lastLocationId != experienceActivity.locations[0].id) {
            locations.push(this.createGroup(experienceActivity.locations[0].name, item, 'activity'))
          } else {
            let lastLocationGroup = locations[locations.length - 1];
            lastLocationGroup.items.push(item)
          }
          lastLocationId = experienceActivity.locations[0].id
          break;
      }
    }
    console.log('------', this.day, '------')
    console.log('locations:', locations)
    console.log('itineraryItems:', itineraryItems, itineraryItems.length)

    // if (locations.length > 1 && itineraryItems.length > 12) {
    //   console.log('herp derp')
    //   const middleIndex = Math.ceil(locations.length / 2);
    //   this.groupColumn1 = locations.slice(0, middleIndex);
    //   this.groupColumn2 = locations.slice(middleIndex);
    // } else {
    //   this.groupColumn1 = locations
    // }
    this.groupColumn1 = locations


    // console.log('column1:', this.column1, 'column2:', this.groupColumn2)
    this.buildLocationGroups(this.groupColumn1)
    this.buildLocationGroups(this.groupColumn2)
    console.log('group1:', this.groupColumn1, 'group2:', this.groupColumn2)
    console.log('----------------')
  }

  buildLocationGroups(groupColumn: itineraryItemGroup[]): void {
    if (!groupColumn) {
      return
    }

    for (const location of groupColumn) {
      if (location.type == 'activity') {
        let lastLandName = 'lastLandName';
        for (const item of location.items) {
          let landName = ''
          switch (item.content_type) {
            case 'experience':
              const experienceActivity = item.activity as Experience
              if (experienceActivity.lands.length) {
                landName = experienceActivity.lands[0].name
              }

              if (item.attributes && 'viewing_location' in item.attributes) {
                landName = item.attributes.viewing_location.name
              }
              if (lastLandName != landName) {
                const newLandGroup = {
                  name: landName,
                  items: [item]
                }
                location.landItems.push(newLandGroup)
              } else {
                let lastLocationGroup = location.landItems[location.landItems.length - 1];
                lastLocationGroup.items.push(item)
              }
              lastLandName = landName
              break;
            case 'meal':
              const mealActivity = item.activity as Meal
              if (mealActivity.meal_experience.lands.length) {
                landName = mealActivity.meal_experience.lands[0].name
              }
              if (lastLandName != landName) {
                const newLandGroup = {
                  name: landName,
                  items: [item]
                }
                location.landItems.push(newLandGroup)
              } else {
                let lastLocationGroup = location.landItems[location.landItems.length - 1];
                // console.log('items:', lastLocationGroup, 'last', lastLandName, 'current', landName)
                lastLocationGroup.items.push(item)
              }
              lastLandName = landName
              break;
            case 'note':
              const newLandGroup = {
                  name: null,
                  items: [item]
                }
              location.landItems.push(newLandGroup)
          }
        }
      }
    }
  }

  buildLocationGroupsOriginal(groupColumn: itineraryItemGroup[]): locationGroup[] {
    const column = []
    if (groupColumn) {
      let lastLocationName = '';
      for (const group of groupColumn) {
        if (group.type == 'activity') {
          let locationName: string;
          let locationType: string;
          if (group.items[0].content_type == 'experience') {
            const activity = group.items[0].activity as Experience
            locationName = activity.locations[0].name
            locationType = activity.locations[0].location_type
          } else if (group.items[0].content_type == 'note') {
            locationName = 'defaultName'
            locationType = 'defaultLocationType'
          } else{
            // console.log('hi:', group.items[0].content_type)
            const activity = group.items[0].activity as Meal
            locationName = activity.meal_experience.locations[0].name
            locationType = activity.meal_experience.locations[0].location_type
          }
          if (lastLocationName !== locationName) {
            let display = true;
            // const location =  group.items[0].activity.locations[0]
            // console.log('location type:', locationType)
            if (this.locationNames.includes(locationName) || locationType != "theme-park") {
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
      const meal = item.activity as Meal;
      if (meal.meal_experience.lands.length > 0) {
        // console.log('herp derp', meal)
        return meal.meal_experience.lands[0].name;
      } else if (meal.meal_experience.locations && meal.meal_experience.locations.length > 0) {
        // Defaulting to the first location's name if available
        return meal.meal_experience.locations[0].name;
      } else {
        return 'Unknown Land';
      }
    } else if (item.activity && 'lands' in item.activity) {
      // console.log('herp derp', item.activity.lands)
      if (item.attributes?.viewing_location) {
        return item.attributes.viewing_location.name
      }
      return item.activity.lands?.[0]?.name || 'Unknown Land';

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
      return `${ item.notes }`;
    } else {
      return 'Unknown Activity';
    }
  }

  getNoteInformation(item: ItineraryItem) {
    return item.notes
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  getTravelType(item: ItineraryItem) {
    const activity = item.activity as TravelEvent
    return this.capitalizeFirstLetter(activity.travel_type)
  }

  getTravelToFrom(item: ItineraryItem): string {

    const activity = item.activity as TravelEvent;

    const fromLocation = activity.custom_from_location
                          ? activity.custom_from_location
                          : activity.from_location.name;

    const toLocation = activity.custom_to_location
                        ? activity.custom_to_location
                        : activity.to_location.name;

    return `${fromLocation} -> ${toLocation}`;
  }

  locationDetails(title: string): string {
    if (title == 'Disneyland Park') {
      return title + ': 7:30AM - 12:00AM'
    }

    if (title == 'Disney California Adventure Park') {
      return title + ': 7:30AM - 10:00PM'
    }

    return title
  }


  buildMealTitle(item: ItineraryItem) {
    const meal = item.activity as Meal;
    const capitalizedMealType = meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1);
    const timeString = item.start_time ? ` - ${moment(item.start_time, 'HH:mm').format('h:mm A')}` : '';

    return `${capitalizedMealType}: ${meal.meal_experience.name}${timeString}`;

  }
}
