import {Component, OnDestroy, OnInit} from '@angular/core';
import {distinctUntilChanged, first, Observable, Subject, Subscription, take, takeUntil, throttleTime} from "rxjs";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../store/app.state";
import * as fromItineraryItemStore from '../../store/itinerary-item/';
import * as fromTripStore from "../../store/trip";
import {ItemsByDay} from "../../store/itinerary-item/";
import {Router} from "@angular/router";
import {filter, tap} from "rxjs/operators";

@Component({
  selector: 'app-itinerary-detail',
  templateUrl: './itinerary-detail.component.html',
  styleUrls: ['./itinerary-detail.component.scss']
})
export class ItineraryDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private currentTripSubscription: Subscription;

  itemsByDay$: Observable<ItemsByDay> = this.store.pipe(
    select(fromItineraryItemStore.SelectAllItemsByDay)
  )

  constructor(private store: Store<AppState>, private router: Router){
    this.router.events.subscribe(event => {
      // console.log("ItineraryDetailComponent Router Event: ", event);
    });

  }
 ngOnInit() {
    // this.currentTripSubscription = this.store.pipe(
  this.store.pipe(
      select(fromTripStore.selectCurrentTrip),
      filter(currentTrip => currentTrip !== null),
      throttleTime(1000),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(currentTrip => {
      // console.log("subscriber:", currentTrip)
      if (currentTrip) {
        console.log(currentTrip.id)
        this.store.dispatch(fromItineraryItemStore.getItineraryItemsRequest({ trip_id: currentTrip.id }));
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
