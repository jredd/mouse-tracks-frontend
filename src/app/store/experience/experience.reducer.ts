// experience.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as ExperienceActions from './experience.actions';
import { Experience } from "./experience.interfaces";

export const experienceFeatureKey = 'experience'

export interface ExperienceState {
  experiences: Experience[];
  loading: boolean;
  error: any;
}

export const initialState: ExperienceState = {
  experiences: [],
  loading: false,
  error: null
};

export const experienceReducer = createReducer(
  initialState,

  on(ExperienceActions.loadExperiences, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ExperienceActions.setExperiences, (state, { experiences }) => ({
    ...state,
    experiences,
    loading: false,
    error: null
  })),

  on(ExperienceActions.setLoading, (state, { isLoading }) => ({
    ...state,
    loading: isLoading,
    error: null
  })),

  on(ExperienceActions.setError, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  }))
);
