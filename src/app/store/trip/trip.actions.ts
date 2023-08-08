import { createAction, props } from '@ngrx/store';
import {Trip} from "./trip.interfaces";

export const loadTrips = createAction(
  '[Trip] Load Trips'
);

export const loadTripsSuccess = createAction(
  '[Trip] Load Trips Success',
  props<{ trips: Trip[] }>()
);

export const loadTripsFailure = createAction(
  '[Trip] Load Trips Failure',
  props<{ error: any }>()
);

export const loadTrip = createAction(
  '[Trip Planner] Load Trip',
  props<{ trip_id: string }>()
);

export const tripLoaded = createAction(
  '[Trip Planner] Trip Loaded',
  props<{ trip: Trip }>()
);

export const loadTripError = createAction(
  '[Trip Planner] Load Trip Error',
  props<{ error: any }>()
);

export const createTripRequest = createAction(
  '[Trip] Create Trip Request',
  props<{ trip: Partial<Trip> }>()
);

export const createTripSuccess = createAction(
  '[Trip] Create Trip Success',
  props<{ trip: Trip }>()
);

export const createTripFailure = createAction(
  '[Trip] Create Trip Failure',
  props<{ error: any }>()
);

export const updateTrip = createAction(
  '[Trip] Update Trip',
  props<{ trip: Partial<Trip> }>() // assuming the trip has an id field to determine which trip to update
);

export const updateTripSuccess = createAction(
  '[Trip] Update Trip Success',
  props<{ updatedTrip: Trip }>()
);

export const updateTripFailure = createAction(
  '[Trip] Update Trip Failure',
  props<{ error: any }>()
);

export const setCurrentTrip = createAction(
  '[Trip] Set Current Trip',
  props<{ trip_id: string }>()
);


export const deactivateCurrentTrip = createAction(
  '[Trip] Deactivate Current Trip'
);
