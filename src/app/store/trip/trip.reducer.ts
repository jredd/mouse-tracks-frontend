import { createReducer, on } from '@ngrx/store';
import { Trip } from "./trip.interfaces";
import * as tripActions from './trip.actions';


export interface TripState {
  trips: Trip[];
  current_trip: Trip | null;
  loading: boolean;
  tripNotFoundInStore: boolean;
  error: any;
}

export const initialTripState: TripState = {
  trips: [],
  current_trip: null,
  loading: false,
  tripNotFoundInStore: false,
  error: null,
};

export const tripReducer = createReducer(
  initialTripState,
  on(tripActions.loadTrips, state => {
    return {...state, loading: true }
  }),

  on(tripActions.loadTripsSuccess, (state,  action) => {
    const newState = {...state, loading: false, trips: action.trips};
    console.log("trip reducer:", newState);
    // console.log("reducer trips:", trips)
    return newState;
  }),
  on(tripActions.loadTripsFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  })),
  on(tripActions.tripLoaded, (state, { trip }) => ({
    ...state,
    current_trip: trip,
    loading: false,
    tripNotFoundInStore: false
  })),
  on(tripActions.createTripSuccess, (state, { trip }) => ({
    ...state,
    current_trip: trip,
    trips: [...state.trips, trip]
  })),
  on(tripActions.createTripFailure, (state, { error }) => {
    // Handle the error, maybe store it in the state or log it
    return { ...state, error };
  }),
  on(tripActions.updateTripSuccess, (state, { updatedTrip }) => ({
    ...state,
    current_rip: state.current_trip?.id === updatedTrip.id ? updatedTrip : state.current_trip,
    trips: state.trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip)
  })),
  on(tripActions.setCurrentTrip, (state, { trip_id }) => {
    const current_trip = state.trips.find(trip => trip.id === trip_id) || null;
    return { ...state, current_trip: current_trip, tripNotFoundInStore: !current_trip };
  }),

  on(tripActions.deactivateCurrentTrip, state => {
    // Logic to deactivate or reset current_trip
    return { ...state, current_trip: null };
  })

);
