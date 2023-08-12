import { createAction, props } from '@ngrx/store';
import { ItineraryItem } from "./itinerary-item.interfaces";
import {Experience} from "../experience/experience.interfaces";
import {Trip} from "../trip/trip.interfaces";

// Existing actions
export const addItineraryItem = createAction(
  '[Itinerary] Add Item',
  props<{ item: Partial<ItineraryItem> }>()
);

export const reorderItineraryItem = createAction(
  '[Itinerary] Reorder Item',
  props<{ day: string; fromIndex: number; toIndex: number }>()
);

export const removeItineraryItem = createAction(
  '[Itinerary] Remove Item',
  props<{ itemId: string }>() // or number, depending on your ID type
);

export const reorderItineraryItems = createAction(
  '[Itinerary] Reorder Items',
  props<{ day: Date, updatedItems: ItineraryItem[] }>()
);

// New actions
export const getItineraryItemsRequest = createAction(
  '[Itinerary Item] Get Items Request',
  props<{ tripId: string }>()
);

export const getItineraryItemsSuccess = createAction(
  '[Itinerary Item] Get Items Success',
  props<{ items: ItineraryItem[] }>()
);

export const getItineraryItemsFailure = createAction(
  '[Itinerary Item] Get Items Failure',
  props<{ error: any }>()
);

export const createItineraryItemRequest = createAction(
  '[Itinerary Item] Create Item Request',
  props<{ tripId: string, item: ItineraryItem }>()
);

export const createItineraryItemSuccess = createAction(
  '[Itinerary Item] Create Item Success',
  props<{ item: ItineraryItem }>()
);

export const createItineraryItemFailure = createAction(
  '[Itinerary Item] Create Item Failure',
  props<{ error: any }>()
);

export const initializeItinerary = createAction(
  '[Itinerary] Initialize',
  props<{ itemsByDay: Record<string, ItineraryItem[]> }>()
);

export const reorderItem = createAction(
  '[Itinerary] Reorder Item',
  props<{ previousIndex: number, currentIndex: number }>()
);

export const addActivityToMyDay = createAction(
  '[Itinerary] Update My Day Plan',
  props<{ activity: Experience, activity_order?: number, trip: Trip }>()
);

export const reorderMyDayActivities = createAction(
    '[Itinerary] Reorder My Day Activities',
    props<{ fromIndex: number, toIndex: number }>()
);

export const removeActivityFromMyDay = createAction(
    '[Itinerary] Remove Activity from My Day Plan',
    props<{ index: number }>() // Using index for removal
);
