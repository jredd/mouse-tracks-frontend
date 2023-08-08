import { createFeatureSelector, createSelector } from '@ngrx/store';
import { tripFeatureKey, TripState } from './trip.reducer';


export const selectTripState = createFeatureSelector<TripState>(tripFeatureKey);

export const selectTrips = createSelector(selectTripState, (tripState) => tripState.trips);
export const selectAllTrips = createSelector(selectTripState, selectTrips);

export const selectLoading = createSelector(
  selectTripState,
  (state: TripState) => state.loading
);
export const selectTrip = createSelector(
  selectTripState,
  (state: TripState) => state.current_trip
);

export const selectError = createSelector(
  selectTripState,
  (state: TripState) => state.error
);

export const selectCurrentTrip = createSelector(selectTripState, selectTrip);

export const selectTripNotFoundInStore = createSelector(
  selectTripState,
  (state: TripState) => state.tripNotFoundInStore
);
