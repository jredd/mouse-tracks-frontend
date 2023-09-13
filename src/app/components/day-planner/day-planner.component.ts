import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CdkDragDrop, CdkDragMove, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Experience, ItineraryItem, Meal, Trip} from "../../store";
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
import { ElementRef, ViewChild } from '@angular/core';
import { DragRef, CdkDrag} from '@angular/cdk/drag-drop';
import { HostListener } from '@angular/core';

type UnifiedDragDropEvent = CdkDragDrop<Experience[] | Partial<ItineraryItem>[] | null, any>;

@Component({
  selector: 'app-day-planner',
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.scss'],
  animations: [fadeIn]
})
export class DayPlannerComponent implements OnInit {
  available$: Observable<Experience[] | null> = EMPTY;
  @ViewChild('dragScrollingContainer') dragScrollingContainer: ElementRef;
  availableActivities: Experience[] = []; // Populate this based on your API or logic
  currentTrip$: Observable<Trip | null> = EMPTY;
  autoScrolling: any;
  currentDay$: Observable<string> = this.store.pipe(
    select(fromItineraryItemStore.selectCurrentDay)
  );
  itineraryItemsByDay$: Observable<Partial<ItineraryItem>[]> = this.store.pipe(
    select(fromItineraryItemStore.selectAllCurrentDayItems),
    map(items => [...items].sort((a, b) => a.activity_order - b.activity_order))
  );



  constructor(public dialogue: MatDialog, private store: Store<AppState>) { }

  openDialog(experience: Experience) {
    this.dialogue.open(DialoguePlannerContentComponent, {
      width: '400px',
      height: '400px',
      data: { type: FormType.MEAL, title: 'Add Meal', experience }
    });
  }

  // startAutoScroll(direction: 'up' | 'down') {
  //   this.stopAutoScroll();
  //   const container = this.dragScrollingContainer.nativeElement;
  //   this.autoScrolling = setInterval(() => {
  //     container.scrollTop += direction === 'up' ? -5 : 5;
  //   }, 16);
  // }

  // stopAutoScroll() {
  //   if (this.autoScrolling) {
  //     clearInterval(this.autoScrolling);
  //     this.autoScrolling = null;
  //   }
  // }

  // onDragMove(event: CdkDragMove<any>) {
  //   // Access the native event from the CdkDragMove event object
  //   const nativeEvent = event.event;
  //
  //   // Initialize clientY variable
  //   let clientY: number;
  //
  //   // Check whether the native event is a MouseEvent or a TouchEvent
  //   if (nativeEvent instanceof MouseEvent) {
  //     clientY = nativeEvent.clientY;
  //   } else if (nativeEvent instanceof TouchEvent && nativeEvent.touches.length > 0) {
  //     clientY = nativeEvent.touches[0].clientY;
  //   } else {
  //     // Unrecognized event type, return or handle accordingly
  //     return;
  //   }
  //
  //   const containerRect = this.dragScrollingContainer.nativeElement.getBoundingClientRect();
  //   const threshold = 50;
  //
  //   if (clientY - containerRect.top < threshold) {
  //     this.startAutoScroll('up');
  //   } else if (containerRect.bottom - clientY < threshold) {
  //     this.startAutoScroll('down');
  //   } else {
  //     this.stopAutoScroll();
  //   }
  // }

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
    // console.log(event.previousContainer.id)
    if (event.previousContainer.id == "AvailableExperiences") {
      // console.log("add")
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
      this.store.dispatch(fromItineraryItemStore.reorderMyDayActivities({fromIndex: event.previousIndex, toIndex: event.currentIndex}))
    } else if (event.previousContainer.id == "MyDayPlan") {
      this.store.dispatch(fromItineraryItemStore.removeActivityFromMyDay({index: event.previousIndex}))
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
        return 'Notes';
      case 'travelevent':
        return 'Travel Event';
      case 'break':
        return 'Break';
      default:
        return 'Default Name';
    }
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


}
