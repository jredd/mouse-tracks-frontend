import { createAction, props } from '@ngrx/store';

import {Experience, ExperienceType, UIExperienceTypes} from "./experience.interfaces";
import { MoveExperiencePayload } from "./experience.reducer";

export const loadExperiences = createAction(
  '[Experience] Load Experiences',
  props<{ loc_id: string }>()
);

// export const setExperiences = createAction(
//   '[Experience] Set Experiences',
//   props<{ experiences: Experience[] }>()
// );

export const loadExperiencesSuccess = createAction(
  '[Experience] Load Experiences Success',
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

export const setCurrentExperienceType = createAction(
  '[Experience] Set Current Experience Type',
  props<{ experienceType: UIExperienceTypes }>()
);

export const moveExperience = createAction(
  '[Experience] Move Experience',
  props<MoveExperiencePayload>()
);

export const loadExperiencesByType = createAction(
  '[Experience] Load Experiences By Type',
  props<{ experienceType: string }>()
);

export const loadExperiencesByTypeSuccess = createAction(
  '[Experience] Load Experiences By Type Success',
  props<{ experiences: Experience[] }>()
);

export const loadExperiencesByTypeFailure = createAction(
  '[Experience] Load Experiences By Type Failure',
  props<{ error: any }>()
);

export const resetExperiences = createAction(
  '[Experience] Reset Experiences'
);
