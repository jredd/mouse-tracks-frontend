import {createFeatureSelector, createSelector} from '@ngrx/store';

import { itineraryFeatureKey, ItineraryState } from "./itinerary-item.reducer";
import { ItineraryItem } from "./itinerary-item.interfaces";

export const selectItineraryState = createFeatureSelector<ItineraryState>(itineraryFeatureKey);

// Selector for itemsByDay
export const selectItemsByDay = createSelector(
  selectItineraryState,
  (itineraryState: ItineraryState) => itineraryState.itemsByDay
);

export const SelectAllItemsByDay = createSelector(
  selectItineraryState, selectItemsByDay
)

// Selector for currentDay
export const selectCurrentDay = createSelector(
  selectItineraryState,
  (itineraryState: ItineraryState) => itineraryState.currentDay
);

export const selectTheCurrentDay = createSelector(
  selectItineraryState,
  selectCurrentDay
);

// Selector for items of the current day
export const selectItemsForCurrentDay = createSelector(
  selectItemsByDay,
  selectCurrentDay,
  (itemsByDay, currentDay) => itemsByDay[currentDay] || []
);

// Selector for loading
export const selectLoading = createSelector(
  selectItineraryState,
  (itineraryState: ItineraryState) => itineraryState.loading
);

// Selector for error
export const selectError = createSelector(
  selectItineraryState,
  (itineraryState: ItineraryState) => itineraryState.error
);

export const selectDeletedItems = createSelector(
  selectItineraryState,
  (itineraryState: ItineraryState) => itineraryState.deletedItems
)

export const selectAllDeletedItems = createSelector(
  selectItineraryState,
  selectDeletedItems
)



export const selectAllCurrentDayItems = createSelector(
    SelectAllItemsByDay,
    selectTheCurrentDay,
    (itemsByDay, currentDay) => {
        // console.log("itemsByDay:", itemsByDay);
        // console.log("currentDay:", currentDay);

        const itemsForCurrentDay = itemsByDay[currentDay];
        if (itemsForCurrentDay) {
            // console.log("Items for the current day:", itemsForCurrentDay);
            return itemsForCurrentDay;
        } else {
            // console.log("No items for the current day.");
            return [];
        }
    }
);

// export const selectItemsByDay = (state: AppState) => state.itemsByDay;

// Then, create a selector to filter out days with no items.
export const selectNonEmptyDaysWithItems = createSelector(
  SelectAllItemsByDay,
  (itemsByDay: { [key: string]: ItineraryItem[] }) => {
    return Object.keys(itemsByDay)
      .filter(day => itemsByDay[day] && itemsByDay[day].length > 0)
      .map(day => ({ day, items: itemsByDay[day] }));
  }
);

export const selectItemsByDayDays = createSelector(
  selectItineraryState,
  (itineraryState: ItineraryState) => Object.keys(itineraryState.itemsByDay)
);

export const selectDays = createSelector(
  selectItineraryState,
  selectItemsByDayDays
);

function getDayLabel(index: number, day: string): string {
  return `${index + 1} - ${day}`;
}
