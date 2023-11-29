import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from "./auth.interfaces";


export const authFeatureKey = 'auth';


export const initialState: AuthState = {
  user_id: '',
  accessToken: '',
  refreshToken: '',
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({ ...state, isLoading: true })),
  on(AuthActions.loginSuccess, (state, { user_id, accessToken, refreshToken }) => ({ ...state, user_id, accessToken, refreshToken, isLoading: false })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, isLoading: false })),

  on(AuthActions.refreshTokenSuccess, (state, { tokens }) => ({
    ...state,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  })),

   on(AuthActions.logout, state => ({
    ...initialState  // Reset to initial state
  })),

  on(AuthActions.logoutSuccess, state => ({
    ...initialState  // Reset to initial state
  })),
);
