import { createReducer, on } from '@ngrx/store';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import * as ItineraryActions from './itinerary-item.actions';
import {ItineraryItem, NewItineraryItem} from './itinerary-item.interfaces';
import * as moment from 'moment';
import { tripLoaded } from "../trip";
import {addActivityToMyDay} from "./itinerary-item.actions";
import { Experience } from "../experience/experience.interfaces";

export const itineraryFeatureKey = 'itinerary_item';

export interface ItineraryState {
  itemsByDay: {
    [key: string]: ItineraryItem[];
  }; // key is the day in 'YYYY-MM-DD' format
  currentDay: string;
  loading: boolean;
  error: any;
}

const initialItemsByDay: Record<string, ItineraryItem[]> = {}; // or however you initialize it

export const initialState: ItineraryState = {
  itemsByDay: initialItemsByDay,
  currentDay: Object.keys(initialItemsByDay)[0] || '',
  loading: false,
  error: null
};

export const itineraryReducer = createReducer(
  initialState,

  // on(ItineraryActions.addItineraryItem, (state, { item }) => {
  //   const dayKey = moment(item.day).format('YYYY-MM-DD');
  //   const itemsForDay = state.itemsByDay[dayKey] || [];
  //   return {
  //     ...state,
  //     itemsByDay: {
  //       ...state.itemsByDay,
  //       [dayKey]: [...itemsForDay, item]
  //     }
  //   };
  // }),
  // on(ItineraryActions.reorderItineraryItems, (state, { day, updatedItems }) => {
  //   const dayKey = moment(day).format('YYYY-MM-DD');
  //   return {
  //     ...state,
  //     itemsByDay: {
  //       ...state.itemsByDay,
  //       [dayKey]: updatedItems
  //     }
  //   };
  // }),

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
    updatedItems.splice(index, 1);

    return {
        ...state,
        itemsByDay: {
            ...state.itemsByDay,
            [state.currentDay]: reorderItems(updatedItems, 0, updatedItems.length - 1)
        }
    };
  }),

  on(ItineraryActions.addActivityToMyDay, (state, { activity, activity_order, trip }) => {
    const currentDayItems = state.itemsByDay[state.currentDay] || [];

    const order = activity_order !== undefined ? activity_order : currentDayItems.length;
    const newItem: NewItineraryItem = {
        trip: trip.id,
        activity_order: order,
        content_type: activity.experience_type,
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
