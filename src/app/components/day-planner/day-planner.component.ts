import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {Experience, ItineraryItem, Trip} from "../../store";
import {combineLatest, EMPTY, Observable, switchMap} from "rxjs";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store/app.state";
import * as fromExperienceStore from '../../store/experience/';
import * as fromItineraryItemStore from '../../store/itinerary-item/';
import {tap, take, map} from "rxjs/operators";
import * as moment from 'moment';
import {addActivityToMyDay, selectAllCurrentDayItems} from "../../store/itinerary-item/";
import {loadTrip, selectCurrentTrip, selectTrip} from "../../store/trip";
import {fadeIn} from "../trip-dashboard/trip-dashboard.animation";
import {DialoguePlannerContentComponent} from "../dialogue-planner-content/dialogue-planner-content.component";
import {MatDialog} from "@angular/material/dialog";
import {FormType} from "../dialogue-planner-content/dialogue-planner-content.interface";

type UnifiedDragDropEvent = CdkDragDrop<Experience[] | Partial<ItineraryItem>[] | null, any>;

@Component({
  selector: 'app-day-planner',
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.scss'],
  animations: [fadeIn]
})
export class DayPlannerComponent implements OnInit {
  available$: Observable<Experience[] | null> = EMPTY;
  availableActivities: Experience[] = []; // Populate this based on your API or logic
  currentTrip$: Observable<Trip | null> = EMPTY;
  currentDay$: Observable<string> = this.store.pipe(
    select(fromItineraryItemStore.selectCurrentDay)
  );
  itineraryItemsByDay$: Observable<Partial<ItineraryItem>[]> = this.store.pipe(
    select(fromItineraryItemStore.selectAllCurrentDayItems)
  );



  constructor(public dialogue: MatDialog, private store: Store<AppState>) { }

  openDialog(experience: Experience) {
    this.dialogue.open(DialoguePlannerContentComponent, {
      width: '400px',
      height: '400px',
      data: { type: 'MEAL', title: 'Add Meal', experience }
    });
  }


  ngOnInit() {
    // this.currentTrip$ = this.store.select(selectCurrentTrip).subscribe(trip => {
    //   this.store.dispatch(fromItineraryItemStore.getItineraryItemsRequest(trip.id))
    // })

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
    if (event.previousContainer.id == "AvailableExperiences") {
      console.log("add")
      const itemToAdd = event.previousContainer.data[event.previousIndex];
      console.log(itemToAdd)
      if (itemToAdd.experience_type == 'restaurant') {
        this.openDialog(itemToAdd)
        return
      }
      this.currentTrip$.pipe(take(1)).subscribe(trip => {
        if (trip) {
          this.store.dispatch(fromItineraryItemStore.addActivityToMyDay({
            itineraryItem: {
              activity: itemToAdd,
              activity_id: itemToAdd.id,
              activity_order: event.currentIndex,
              trip: trip,
              content_type: 'experience',
              notes: ''
            }
          }));
        }
      });
    } else if (event.previousContainer == event.container) {
      // console.log("reorder")
      this.store.dispatch(fromItineraryItemStore.reorderMyDayActivities({fromIndex: event.previousIndex, toIndex: event.currentIndex}))
    } else if (event.previousContainer.id == "MyDayPlan") {
      // console.log("delete")
      this.store.dispatch(fromItineraryItemStore.removeActivityFromMyDay({index: event.currentIndex}))
    }

  }

  getFallbackName(item: any): string { // Replace 'any' with the actual type, if you can
    switch (item.content_type) {
      case 'meal':
        return 'Meal';
      case null:
        return 'Notes';
      case 'travelevent':
        return 'Travel Event';
      case 'break':
        return 'Break';
      default:
        return 'Default Name';
    }
  }

  getDisplayName(item: any): string { // Replace 'any' with the actual type, if you can
    if (item.activity && 'name' in item.activity) {
      return item.activity.name;
    }

    return this.getFallbackName(item);
  }


}
