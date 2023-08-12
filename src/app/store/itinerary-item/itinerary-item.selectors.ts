import {createFeatureSelector, createSelector} from '@ngrx/store';

import { AppState } from "../app.state";
import {itineraryFeatureKey, ItineraryState} from "./itinerary-item.reducer";
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

// export const selectAllCurrentDayItems = createSelector(
//     selectItemsByDay,
//     selectCurrentDay,
//     (itemsByDay, currentDay) => itemsByDay[currentDay] || []
// );

// export const selectAllCurrentDayItems = createSelector(
//   selectItemsByDay,selectCurrentDayItems
// )

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
