import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {ContentType, Experience, ItineraryItem, Meal, Trip} from "../../store";
import { EMPTY, Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store/app.state";
import * as fromExperienceStore from '../../store/experience/';
import * as fromItineraryItemStore from '../../store/itinerary-item/';
import { tap, take, map } from "rxjs/operators";
import { selectCurrentTrip } from "../../store/trip";
import { fadeIn, flyInOut } from "../trip-dashboard/trip-dashboard.animation";
import { DialoguePlannerContentComponent } from "../dialogue-planner-content/dialogue-planner-content.component";
import { MatDialog } from "@angular/material/dialog";
import { FormType } from "../dialogue-planner-content/dialogue-planner-content.interface";
import { ElementRef, ViewChild } from '@angular/core';
import {removeActivityFromMyDay} from "../../store/itinerary-item/";
import Fuse from "fuse.js";


@Component({
  selector: 'app-day-planner',
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.scss'],
  animations: [fadeIn, flyInOut]
})
export class DayPlannerComponent implements OnInit {
  available$: Observable<Experience[] | null> = EMPTY;
  @ViewChild('dragScrollingContainer') dragScrollingContainer: ElementRef;
  currentTrip$: Observable<Trip | null> = EMPTY;
  isIconsVisible: { [id: string]: boolean } = {};
  itineraryItemsByDay$: Observable<ItineraryItem[]> = this.store.pipe(
    select(fromItineraryItemStore.selectAllCurrentDayItems),
    map(items => [...items].sort((a, b) => a.activity_order - b.activity_order))
  );
  searchTerm: string = '';



  constructor(public dialogue: MatDialog, private store: Store<AppState>) { }

  // filterExperiences(experiences: Experience[] | null): Experience[] {
  //     if (!experiences || !this.searchTerm) return experiences ? experiences : [];
  //     return experiences.filter(exp => exp.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  // }

  filterExperiences(experiences: Experience[] | null): Experience[] {
    if (!experiences || !this.searchTerm) return experiences ? experiences : [];

    const options = {
        keys: ['name'],
        includeScore: true,
        threshold: 0.3  // You can adjust this for stricter or more lenient matching.
    };

    const fuse = new Fuse(experiences, options);
    const results = fuse.search(this.searchTerm);

    return results.map(result => result.item);
  }

  getFormTypeFromContentType(contentType: ContentType): FormType {
    switch (contentType) {
      case 'meal':
        return FormType.MEAL;
      case 'travelevent':
        return FormType.TRAVEL_EVENT;
      case 'note':
        return FormType.NOTE;
      case 'break':
        return FormType.BREAK;
      case 'experience':
        return FormType.EXPERIENCE;
      default:
        return FormType.NOTE; // default to note or throw an error if unrecognized
    }
  }

  openDialog(experience: Experience | false = false, item: ItineraryItem | false = false, index: number | null = null): void {
    let dialogData;

    // Type guards
    const isExperience = (exp: Experience | false): exp is Experience => typeof exp !== 'boolean';
    const isItineraryItem = (it: ItineraryItem | false): it is ItineraryItem => typeof it !== 'boolean';

    if (!experience && !item) {
      throw new Error('Either experience or item must be provided');
    }

    if (isExperience(experience)) { // This is an Experience
      dialogData = { type: FormType.MEAL, title: 'Add Meal', activity: experience, index };
    } else if (isItineraryItem(item)) { // This is an ItineraryItem
      const formType = this.getFormTypeFromContentType(item.content_type);
      // console.log("found form type", formType)
      dialogData = { type: formType, title: 'Edit Item', itineraryItem: item };
    } else {
      throw new Error('Invalid input types');
    }

    this.dialogue.open(DialoguePlannerContentComponent, {
        data: dialogData
    });
  }

  searchChanged(event: any) {
    // re-fetch the data or update the available list
    this.available$ = this.store.pipe(
        select(fromExperienceStore.selectExperiencesByType),
        map(experiences => this.filterExperiences(experiences))
    );
  }

  ngOnInit() {

    this.available$ = this.store.pipe(
      select(fromExperienceStore.selectExperiencesByType),
      map(experiences => this.filterExperiences(experiences)),
      tap(data => {
          // console.log('Selected Experiences:', data);
      })
    );

    this.available$ = this.store.pipe(
      select(fromExperienceStore.selectExperiencesByType),
      tap(data => {
        // console.log('Selected Experiences:', data);
      })
    );

    this.currentTrip$ = this.store.select(selectCurrentTrip).pipe(
      tap(currentTrip => {

        if (currentTrip) {
          // this.store.dispatch(fromItineraryItemStore.getItineraryItemsRequest({ tripId: currentTrip.id }));
        }
      })
    );
    this.itineraryItemsByDay$.subscribe(data => {
      // console.log('day Items:', data);
    });
  }


  drop(event: CdkDragDrop<any>) {
    // console.log(event.previousContainer.id)
    if (event.previousContainer.id == "AvailableExperiences") {
      // console.log("add")
      const experienceToAdd = event.previousContainer.data[event.previousIndex];
      console.log(experienceToAdd)
      if (experienceToAdd.experience_type == 'restaurant') {
        this.openDialog(experienceToAdd, false, event.currentIndex)
        return
      }
      this.currentTrip$.pipe(take(1)).subscribe(trip => {
        if (trip) {
          this.store.dispatch(fromItineraryItemStore.addActivityToMyDay({
            itineraryItem: {
              activity: experienceToAdd,
              activity_id: experienceToAdd.id,
              activity_order: event.currentIndex,
              trip: trip.id,
              content_type: 'experience',
              note: ''
            }
          }));
        }
      });
    } else if (event.previousContainer == event.container) {
      this.store.dispatch(fromItineraryItemStore.reorderMyDayActivities({fromIndex: event.previousIndex, toIndex: event.currentIndex}))
    }
  }

  getFallbackName(item: ItineraryItem): string { // Replace 'any' with the actual type, if you can
    switch (item.content_type) {
      case 'meal':
        const meal = item.activity as Meal;
        const mealType = this.capitalizeFirstLetter(meal.meal_type) ?? 'Unknown Meal Type';
        const name = meal.meal_experience?.name ?? 'Unknown Experience';
        return `${mealType}: ${name}`;
      case 'note':
        return 'Note';
      case 'travelevent':
        return 'Travel Event';
      case 'break':
        return 'Break';
      default:
        return 'Default Name';
    }
  }

  truncateNote(note?: string, limit: number = 8): string {
    if (!note) return '';  // Return empty string if note are undefined or falsy

    const words = note.split(' ').slice(0, limit);
    return words.join(' ') + (words.length < note.split(' ').length ? '...' : '');
  }

  capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  getDisplayName(item: any): string { // Replace 'any' with the actual type, if you can
    if (item.activity && 'name' in item.activity) {
      return item.activity.name;
    }

    return this.getFallbackName(item);
  }

  getItemKey(item: ItineraryItem): string {
    if ('id' in item) {
      return item.id;
    }
    if ('tempId' in item) {
      return item.tempId;
    }
    return '';
  }

  showIcons(item: ItineraryItem) {
    const key = this.getItemKey(item);
    this.isIconsVisible[key] = true;
  }

  hideIcons(item: ItineraryItem) {
    const key = this.getItemKey(item);
    this.isIconsVisible[key] = false;
  }

  onEdit(item: ItineraryItem) {
    this.openDialog(false, item);
  }

  onDelete(item: ItineraryItem) {
    this.store.dispatch(removeActivityFromMyDay({ item }));
  }
}
