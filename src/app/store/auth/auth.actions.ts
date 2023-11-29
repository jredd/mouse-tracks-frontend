import { createAction, props } from '@ngrx/store';


export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user_id: string; accessToken: string; refreshToken: string }>()
);
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());
export const refreshToken = createAction('[Auth] Refresh Token', props<{ refreshToken: string }>());

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ tokens: { accessToken: string; refreshToken: string } }>()
);
export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: any }>()
);

export const checkStoredAuth = createAction(
  '[Auth] Check Stored Authentication'
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');
