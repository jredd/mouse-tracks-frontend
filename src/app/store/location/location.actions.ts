import { createAction, props } from '@ngrx/store';
import { Location } from '../../store';


export const loadLocations = createAction(
  '[Location] Load Locations',
  props<{ destId: string }>()
);

export const loadLocationsSuccess = createAction(
  '[Location] Load Locations Success',
  props<{ locations: Location[] }>()
);

export const loadLocationsFailure = createAction(
  '[Location] Load Locations Failure',
  props<{ error: any }>()
);
