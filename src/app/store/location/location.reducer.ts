import { createReducer, on } from '@ngrx/store';
import { loadLocations, loadLocationsSuccess, loadLocationsFailure } from './location.actions';
import { Location } from "./location.interfaces";

export const locationFeatureKey = 'location';

export interface LocationState {
  locations: Location[];
  loading: boolean;
  error: any;
}

export const initialState: LocationState = {
  locations: [],
  loading: false,
  error: null
};

export const locationReducer = createReducer(
  initialState,
  on(loadLocations, (state) => ({ ...state, loading: true })),
  on(loadLocationsSuccess, (state, { locations }) => ({ ...state, locations, loading: false })),
  on(loadLocationsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
