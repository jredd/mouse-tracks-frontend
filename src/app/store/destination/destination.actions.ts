import { createAction, props } from '@ngrx/store';

import { Destination } from "./destination.interfaces";


export const loadDestinations = createAction(
  '[Destination] Load Destinations'
);

export const loadDestinationsSuccess = createAction(
  '[Destination] Load Destinations Success',
  props<{ destinations: Destination[] }>()
);

export const loadDestinationsFailure = createAction(
  '[Destination] Load Destinations Failure',
  props<{ error: any }>()
);

// New actions
export const loadDestination = createAction(
  '[Destination] Load Destination',
  props<{ destId: string }>()
);

export const loadDestinationSuccess = createAction(
  '[Destination] Load Destination Success',
  props<{ destination: Destination }>()
);

export const loadDestinationFailure = createAction(
  '[Destination] Load Destination Failure',
  props<{ error: any }>()
);
