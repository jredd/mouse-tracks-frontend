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

type UnifiedDragDropEvent = CdkDragDrop<Experience[] | Partial<ItineraryItem>[] | null, any>;

@Component({
  selector: 'app-day-planner',
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.scss']
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



  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.currentTrip$ = this.store.select(selectCurrentTrip)
    this.available$ = this.store.pipe(
      select(fromExperienceStore.selectExperiencesByType),
      tap(data => {
        // console.log('Selected Experiences:', data);
      })
    );
    this.itineraryItemsByDay$.subscribe(data => {
      // console.log('day Items:', data);
    });
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer.id == "AvailableExperiences") {
      console.log("add")
      // Add the item to the "My Day Plan" list but don't remove it from "Available Experiences"
      const itemToAdd = event.previousContainer.data[event.previousIndex];
      this.currentTrip$.pipe(take(1)).subscribe(trip => {
        console.log("trip:", trip)
        if (trip) {
          this.store.dispatch(fromItineraryItemStore.addActivityToMyDay({
            activity: itemToAdd,
            activity_order: event.currentIndex,
            trip: trip
          }));
        }
      });
    } else if (event.previousContainer == event.container) {
      console.log("reorder")
      this.store.dispatch(fromItineraryItemStore.reorderMyDayActivities({fromIndex: event.previousIndex, toIndex: event.currentIndex}))
    } else if (event.previousContainer.id == "MyDayPlan") {
      console.log("delete")
      this.store.dispatch(fromItineraryItemStore.removeActivityFromMyDay({index: event.currentIndex}))
    }

  }



// onSave() {
//   this.store.select(state => state.pendingChanges).pipe(
//     take(1),
//     switchMap(pendingChanges => {
//       const saveRequests = pendingChanges.map(change =>
//         this.yourApiService.saveItineraryItem(change) // or update based on the nature of the change
//       );
//       return forkJoin(saveRequests);
//     })
//   ).subscribe(
//     responses => {
//       // Handle successful saves, dispatch action to clear pendingChanges, etc.
//     },
//     error => {
//       // Handle errors
//     }
//   );
// }




}
