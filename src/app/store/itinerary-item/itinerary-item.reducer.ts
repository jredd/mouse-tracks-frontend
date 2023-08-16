import { createReducer, on } from '@ngrx/store';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import * as ItineraryActions from './itinerary-item.actions';
import {ItineraryItem, NewItineraryItem} from './itinerary-item.interfaces';
import * as moment from 'moment';
import { tripLoaded } from "../trip";
import {addActivityToMyDay, clearDeletedItems, deactivateItineraryItems} from "./itinerary-item.actions";
import { Experience } from "../experience/experience.interfaces";
import * as tripActions from "../trip/trip.actions";

export const itineraryFeatureKey = 'itinerary_item';

export interface ItineraryState {
  itemsByDay: {
    [key: string]: ItineraryItem[];
  }; // key is the day in 'YYYY-MM-DD' format
  currentDay: string;
  deletedItems: ItineraryItem[];
  loading: boolean;
  error: any;
}

const initialItemsByDay: Record<string, ItineraryItem[]> = {}; // or however you initialize it

export const initialState: ItineraryState = {
  itemsByDay: initialItemsByDay,
  deletedItems: [],
  currentDay: Object.keys(initialItemsByDay)[0] || '',
  loading: false,
  error: null
};

export const itineraryReducer = createReducer(
  initialState,

  on(tripLoaded, (state, { trip }) => {
      const startDate = moment(trip.start_date);
      const endDate = moment(trip.end_date);
      const itemsByDay = generateEmptyDateRange(startDate.toDate(), endDate.toDate());
      return {
          ...state,
          currentDay: startDate.format('YYYY-MM-DD'),
          itemsByDay: {
              ...state.itemsByDay,
              ...itemsByDay
          }
      };
  }),


  on(ItineraryActions.getItineraryItemsSuccess, (state, { items }) => {
    const newItemsByDay = { ...state.itemsByDay };
    for (let item of items) {
      const dayKey = moment(item.day).format('YYYY-MM-DD');
      newItemsByDay[dayKey] = [...(newItemsByDay[dayKey] || []), item];
    }
    return {
      ...state,
      itemsByDay: newItemsByDay,
      loading: false
    };
  }),

  on(ItineraryActions.createItineraryItemSuccess, (state, { item }) => {
    const dayKey = moment(item.day).format('YYYY-MM-DD');
    return {
      ...state,
      itemsByDay: {
        ...state.itemsByDay,
        [dayKey]: [...(state.itemsByDay[dayKey] || []), item]
      },
      loading: false
    };
  }),

  on(ItineraryActions.reorderItem, (state, { previousIndex, currentIndex }) => {
    // Create a shallow copy of itemsByDay
    const updatedItemsByDay = { ...state.itemsByDay };

    // Assuming 'currentDay' represents the list we're reordering
    moveItemInArray(updatedItemsByDay[state.currentDay], previousIndex, currentIndex);

    return { ...state, itemsByDay: updatedItemsByDay };
  }),

  on(ItineraryActions.removeActivityFromMyDay, (state, { index }) => {
      const currentDayItems = state.itemsByDay[state.currentDay] || [];

      // Splice to remove the item at the specified index
      const updatedItems = [...currentDayItems];
      const removedItem = updatedItems.splice(index, 1)[0];

      // New logic: Add the removed item to deletedItems if it has an id
      const updatedDeletedItems = 'id' in removedItem && removedItem.id
                                ? [...state.deletedItems, removedItem]
                                : state.deletedItems;

      return {
          ...state,
          deletedItems: updatedDeletedItems,
          itemsByDay: {
              ...state.itemsByDay,
              [state.currentDay]: reorderItems(updatedItems, 0, updatedItems.length - 1)
          }
      };
  }),


  on(ItineraryActions.addActivityToMyDay, (state, { activity, activity_order, trip }) => {
    const currentDayItems = state.itemsByDay[state.currentDay] || [];
    console.log('activity to add:', activity);

    const order = activity_order !== undefined ? activity_order : currentDayItems.length;

    // Create a unique temporary ID.
    // You could use other mechanisms as well, like a UUID library or a simple counter.
    const tempId = `temp-${Date.now()}-${Math.round(Math.random() * 1000)}`;

    const newItem: NewItineraryItem = {
        tempId: tempId,
        trip: trip.id,
        activity_order: order,
        content_type: 'experience',
        activity_id: activity.id,
        day: moment(state.currentDay).toDate(),
        activity: activity,
    };

    // Add the new item to the end of the currentDayItems, then use reorderItems to move it to the correct position.
    const itemsWithNewItem = [...currentDayItems, newItem];
    const updatedItems = reorderItems(itemsWithNewItem, itemsWithNewItem.length - 1, order);

    return {
        ...state,
        itemsByDay: {
            ...state.itemsByDay,
            [state.currentDay]: updatedItems
        }
    };
  }),

  on(ItineraryActions.reorderMyDayActivities, (state, { fromIndex, toIndex }) => {
    const currentDayItems = state.itemsByDay[state.currentDay] || [];
    const updatedItems = reorderItems(currentDayItems, fromIndex, toIndex);

    return {
        ...state,
        itemsByDay: {
            ...state.itemsByDay,
            [state.currentDay]: updatedItems
        }
    };
  }),

  on(ItineraryActions.deactivateItineraryItems, state => {
    return { ...state, itemsByDay: initialItemsByDay, currentDay: '' };
  }),

  on(ItineraryActions.clearDeletedItems, state => {
    return { ...state, deletedItems: [] };
  }),

  on(ItineraryActions.replaceItem, (state, { tempId, newItem }) => {
    const updatedItemsByDay = {...state.itemsByDay};  // Shallow copy the dictionary

    // Iterate over each key in the dictionary
    for (const day in updatedItemsByDay) {
      if (updatedItemsByDay.hasOwnProperty(day)) {
        updatedItemsByDay[day] = updatedItemsByDay[day].map(item =>
          isNewItem(item) && item.tempId === tempId ? newItem : item
        );
      }
    }

    return {
      ...state,
      itemsByDay: updatedItemsByDay
    };
  }),

  on(ItineraryActions.setCurrentDay, (state, { day }) => {
    return { ...state, currentDay: day };
  })
);

export function generateEmptyDateRange(startDate: Date, endDate: Date): Record<string, ItineraryItem[]> {
  const start = moment(startDate);
  const end = moment(endDate);
  const range: Record<string, ItineraryItem[]> = {};

  while (!start.isAfter(end)) {
    const formattedDate = start.format('YYYY-MM-DD');
    range[formattedDate] = [];
    start.add(1, 'day');
  }

  return range;
}

function reorderItems(items: ItineraryItem[], fromIndex: number, toIndex: number): ItineraryItem[] {
    if (fromIndex === toIndex) return items;

    const itemToMove = items[fromIndex];
    const updatedItems = items.filter((_, index) => index !== fromIndex);
    updatedItems.splice(toIndex, 0, itemToMove);

    // Recalculate activity_order for the reordered items
    return updatedItems.map((item, index) => {
        return { ...item, activity_order: index };
    });
}

function isNewItem(item: ItineraryItem): item is NewItineraryItem {
  return 'tempId' in item;
}
