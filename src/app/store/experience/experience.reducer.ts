import { createReducer, on } from '@ngrx/store';

import * as ExperienceActions from './experience.actions';
import {Experience, ExperienceType} from "./experience.interfaces";


export const experienceFeatureKey = 'experience'

export interface MoveExperiencePayload {
  experienceId: string;
  from: 'available' | 'selected';
  to: 'available' | 'selected';
}



export interface ExperienceState {
  currentExperienceTypeSelection: ExperienceType;
  experiencesByType: {
    attraction: Experience[];
    restaurant: Experience[];
    entertainment: Experience[];
    event: Experience[];
  };
  experiences: Experience[];
  loading: boolean;
  error: any;
}

export const initialState: ExperienceState = {
  currentExperienceTypeSelection: 'attraction',
  experiencesByType: {
    restaurant: [],
    attraction: [],
    entertainment: [],
    event: [],
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
      attraction: experiences.filter(exp => exp.experience_type === 'attraction'),
      restaurant: experiences.filter(exp => exp.experience_type === 'restaurant'),
      entertainment: experiences.filter(exp => exp.experience_type === 'entertainment'),
      event: experiences.filter(exp =>
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
  // on(ExperienceActions.moveExperience, (state, { experienceId, from, to }) => {
  //   const experienceToMove = state.experiencesByType[from].find(e => e.id === experienceId);
  //
  //   if (!experienceToMove) return state;
  //
  //   return {
  //     ...state,
  //     experiencesByType: {
  //       ...state.experiencesByType,
  //       [from]: state.experiencesByType[from].filter(e => e.id !== experienceId),
  //       [to]: [...state.experiencesByType[to], experienceToMove]
  //     }
  //   };
  // })
);
