import { createReducer, on } from '@ngrx/store';
import * as DestinationActions from './destination.actions';
import { Destination } from "./destination.interfaces";

export const destinationFeatureKey = 'destination';

export interface DestinationState {
  // would include properties of Destination model and additional state properties
  // for example, error and loading properties
  destinations: Destination[];
  loading: boolean;
  error: any;
}

export const initialState: DestinationState = {
  destinations: [],
  loading: false,
  error: null,
};

export const destinationReducer = createReducer(
  initialState,

  on(DestinationActions.loadDestinations, state => {
    return { ...state, loading: true };
  }),

  on(DestinationActions.loadDestinationsSuccess, (state, action) => {
    return { ...state, loading: false, destinations: action.destinations };
  }),

  on(DestinationActions.loadDestinationsFailure, (state, action) => {
    return { ...state, loading: false, error: action.error };
  }),



  // Add similar `on` handlers for other actions
);
