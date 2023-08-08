import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";

import { tripReducer, TripState } from "./trip";
import { environment } from "../../environments/environment";
import { destinationReducer, DestinationState } from "./destination";
import { locationReducer, LocationState } from "./location";


export interface AppState {
  trip: TripState;
  destination: DestinationState;
  location: LocationState;
  // Add other feature states as needed
}

export const appReducers: ActionReducerMap<AppState> = {
  trip: tripReducer,
  destination: destinationReducer,
  location: locationReducer,
  // Add other feature reducers as needed
};

export function debugLogger(appReducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    // console.log('state', state);
    // console.log('action', action);
    //
    return appReducer(state, action);
  };
}

// Only add debug meta-reducer if not in production
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [debugLogger] : [];
