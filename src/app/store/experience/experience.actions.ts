// experience.actions.ts
import { createAction, props } from '@ngrx/store';
import {Experience} from "./experience.interfaces";

export const loadExperiences = createAction(
  '[Experience] Load Experiences',
  props<{ loc_id: string }>()
);

export const setExperiences = createAction(
  '[Experience] Set Experiences',
  props<{ experiences: Experience[] }>()
);

export const setLoading = createAction(
  '[Experience] Set Loading',
  props<{ isLoading: boolean }>()
);

export const setError = createAction(
  '[Experience] Set Error',
  props<{ error: any }>()
);
