import { Component, OnInit } from '@angular/core';
import {Observable, take} from "rxjs";
import {select, Store} from "@ngrx/store";
// import * as fromItineraryItemStore from "../../store/itinerary-item/itinerary-item.effects";
import {AppState} from "../../store/app.state";
import * as fromItineraryItemStore from '../../store/itinerary-item/';
import {ItineraryItem} from "../../store";
import * as fromTripStore from "../../store/trip";
import {ItemsByDay, SelectAllItemsByDay} from "../../store/itinerary-item/";

@Component({
  selector: 'app-itinerary-detail',
  templateUrl: './itinerary-detail.component.html',
  styleUrls: ['./itinerary-detail.component.scss']
})
export class ItineraryDetailComponent implements OnInit{
  // days$: Observable<string[]> = this.store.pipe(
  //   select(fromItineraryItemStore.selectDays)
  // );

  itemsByDay$: Observable<ItemsByDay> = this.store.pipe(
    select(fromItineraryItemStore.SelectAllItemsByDay)
  )

  constructor(private store: Store<AppState>){}
 ngOnInit() {
  this.store.pipe(
    select(fromTripStore.selectCurrentTrip),
  ).subscribe(currentTrip => {
      if (currentTrip) {
        console.log('current trip:', currentTrip)
        this.store.dispatch(fromItineraryItemStore.getItineraryItemsRequest({ trip_id: currentTrip.id }));
      }
    })
  }
}
