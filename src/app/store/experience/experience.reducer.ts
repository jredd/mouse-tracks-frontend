import { createReducer, on } from '@ngrx/store';

import * as ExperienceActions from './experience.actions';
import {Experience, ExperienceType, UIExperienceTypes} from "./experience.interfaces";


export const experienceFeatureKey = 'experience'

export interface MoveExperiencePayload {
  experienceId: string;
  from: 'available' | 'selected';
  to: 'available' | 'selected';
}



export interface ExperienceState {
  currentExperienceTypeSelection: UIExperienceTypes;
  experiencesByType: {
    attractions: Experience[];
    restaurants: Experience[];
    entertainment: Experience[];
    events: Experience[];
  };
  experiences: Experience[];
  loading: boolean;
  error: any;
}

export const initialState: ExperienceState = {
  currentExperienceTypeSelection: 'attractions',
  experiencesByType: {
    restaurants: [],
    attractions: [],
    entertainment: [],
    events: [],
  },
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
  on(ExperienceActions.loadExperiencesSuccess, (state, { experiences }) => {
    const experiencesByType = {
      attractions: experiences.filter(exp => exp.experience_type === 'attraction'),
      restaurants: experiences.filter(exp => exp.experience_type === 'restaurant'),
      entertainment: experiences.filter(exp => exp.experience_type === 'entertainment'),
      events: experiences.filter(exp =>
        exp.experience_type === 'event' ||
        exp.experience_type === 'dining-event' ||
        exp.experience_type === 'dinner-show'
      )
    };
    return {
      ...state,
      experiences,
      experiencesByType,
      loading: false,
      error: null
    };
  }),
  on(ExperienceActions.setCurrentExperienceType, (state, { experienceType }) => ({
    ...state,
    currentExperienceTypeSelection: experienceType
  })),

  on(ExperienceActions.loadExperiencesSuccess, (state, { experiences }) => ({
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
  })),
);
