import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey } from "./auth.reducer";
import { AuthState } from "./auth.interfaces";

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey)


const isAuthenticated = createSelector(
  selectAuthState,
  auth => !!auth.accessToken
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  isAuthenticated
)

const AccessToken = createSelector(
  selectAuthState,
  auth => auth.accessToken
)

export const selectAccessToken = createSelector(
  selectAuthState,
  AccessToken
)
