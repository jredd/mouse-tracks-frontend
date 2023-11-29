import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";

import { tripReducer, TripState } from "./trip";
import { environment } from "../../environments/environment";
import { destinationReducer, DestinationState } from "./destination";
import { locationReducer, LocationState } from "./location";
import { experienceReducer, ExperienceState } from "./experience";
import { itineraryReducer, ItineraryState } from "./itinerary-item";
import {AuthState} from "./auth/auth.interfaces";
import {authReducer} from "./auth/auth.reducer";


export interface AppState {
  trip: TripState;
  destination: DestinationState;
  location: LocationState;
  experience: ExperienceState;
  itinerary_item: ItineraryState
  auth: AuthState
  // Add other feature states as needed
}

export const appReducers: ActionReducerMap<AppState> = {
  trip: tripReducer,
  destination: destinationReducer,
  location: locationReducer,
  experience: experienceReducer,
  itinerary_item: itineraryReducer,
  auth: authReducer

  // Add other feature reducers as needed
};

export function debugLogger(appReducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    // console.log('state', state);
    // console.log('action', action);

    return appReducer(state, action);
  };
}

// Only add debug meta-reducer if not in production
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [debugLogger] : [];
