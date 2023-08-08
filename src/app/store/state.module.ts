import { isDevMode, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { appReducers, metaReducers } from "./app.state";
import { TripEffects, tripFeatureKey, tripReducer } from "./trip";
import { DestinationEffects, destinationFeatureKey, destinationReducer } from "./destination";
import { LocationEffects, locationFeatureKey, locationReducer } from "./location";

@NgModule({
  imports: [
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreModule.forFeature(tripFeatureKey, { trip: tripReducer }),
    StoreModule.forFeature(destinationFeatureKey, { destination: destinationReducer }),
    StoreModule.forFeature(locationFeatureKey, { location: locationReducer }),
    EffectsModule.forRoot([DestinationEffects, TripEffects, LocationEffects]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ]
})
export class StateModule {}
