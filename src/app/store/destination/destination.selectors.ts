import { createFeatureSelector, createSelector } from '@ngrx/store';

import { destinationFeatureKey, DestinationState } from './destination.reducer';


export const selectDestinationState = createFeatureSelector<DestinationState>(destinationFeatureKey);

export const selectDestinations = createSelector(
  selectDestinationState,
  (state: DestinationState) => state.destinations
);

export const selectAllDestinations = createSelector(
  selectDestinationState,
  selectDestinations
);

export const selectDestinationsLoading = createSelector(
  selectDestinationState,
  (state: DestinationState) => state.loading
);

export const selectAllDestinationsLoading = createSelector(
  selectDestinationState,
  selectDestinationsLoading
)

export const selectDestinationsError = createSelector(
  selectDestinationState,
  (state: DestinationState) => state.error
);

export const selectDestinationById = createSelector(
  selectDestinationState,
  (destinationState: DestinationState, props: { id: string }) =>
    destinationState.destinations.find(destination => destination.id === props.id)
);

