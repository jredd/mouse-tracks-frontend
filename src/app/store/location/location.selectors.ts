import { createSelector, createFeatureSelector } from '@ngrx/store';

import { locationFeatureKey, LocationState } from "./location.reducer";


export const selectLocationState = createFeatureSelector<LocationState>(locationFeatureKey);

export const selectLocations = createSelector(
  selectLocationState,
  (state: LocationState) => state.locations
);

export const selectAllLocations = createSelector(
  selectLocationState, selectLocations
)

export const selectLocationsLoading = createSelector(
  selectLocationState,
  (state: LocationState) => state.loading
);
