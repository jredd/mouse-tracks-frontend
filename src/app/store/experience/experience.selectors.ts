import { createSelector, createFeatureSelector } from '@ngrx/store';

import {experienceFeatureKey, ExperienceState} from "./experience.reducer";


export const selectExperienceState = createFeatureSelector<ExperienceState>(experienceFeatureKey);

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

export const selectCurrentExperienceType = createSelector(
  selectExperienceState,
  (state: ExperienceState) => state.currentExperienceTypeSelection
);


export const selectExperiencesType = createSelector(
    selectExperienceState,
    state => {
        let key: keyof typeof state.experiencesByType;

        switch(state.currentExperienceTypeSelection) {
          case 'dining-event':
            key = 'event';
            break;
          case 'dinner-show':
            key = 'event';
            break
          default:
            key = state.currentExperienceTypeSelection;
            break;
        }

        const experiences = state.experiencesByType[key];
        return experiences && experiences.length ? experiences : null;
    }
);



export const selectExperiencesByType = createSelector(
  selectExperienceState, selectExperiencesType
)

export const selectAttractionExperiences = createSelector(
  selectAllExperiences,
  experiences => experiences.filter(e => e.experience_type === 'attraction')
);

export const selectEntertainmentExperiences = createSelector(
  selectAllExperiences,
  experiences => experiences.filter(e => e.experience_type === 'entertainment')
);

export const selectEventExperiences = createSelector(
  selectAllExperiences,
  experiences => experiences.filter(e => e.experience_type === 'event')
);
