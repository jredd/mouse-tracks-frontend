// experience.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';

import { ExperienceState } from "./experience.reducer";


export const selectExperienceState = createFeatureSelector<ExperienceState>('experience');

export const selectAllExperiences = createSelector(
  selectExperienceState,
  (state: ExperienceState) => state.experiences
);

export const selectExperienceLoading = createSelector(
  selectExperienceState,
  (state: ExperienceState) => state.loading
);

export const selectExperienceError = createSelector(
  selectExperienceState,
  (state: ExperienceState) => state.error
);
