import { isDevMode, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { appReducers, metaReducers } from "./app.state";
import { TripEffects, tripFeatureKey, tripReducer } from "./trip";
import { DestinationEffects, destinationFeatureKey, destinationReducer } from "./destination";
import { LocationEffects, locationFeatureKey, locationReducer } from "./location";
import {ExperienceEffects, experienceFeatureKey, experienceReducer} from "./experience";
import {itineraryFeatureKey, ItineraryItemEffects, itineraryReducer} from "./itinerary-item";

@NgModule({
  imports: [
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreModule.forFeature(tripFeatureKey, { trip: tripReducer }),
    StoreModule.forFeature(destinationFeatureKey, { destination: destinationReducer }),
    StoreModule.forFeature(locationFeatureKey, { location: locationReducer }),
    StoreModule.forFeature(experienceFeatureKey, { experience: experienceReducer }),
    StoreModule.forFeature(itineraryFeatureKey, { itinerary_item: itineraryReducer }),
    EffectsModule.forRoot([
      DestinationEffects, TripEffects, LocationEffects, ExperienceEffects, ItineraryItemEffects
    ]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ]
})
export class StateModule {}
