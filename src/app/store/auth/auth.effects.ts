import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {forkJoin, Observable, of, withLatestFrom} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as AuthActions from './auth.actions';
// import { AuthService } from "../../components/auth/auth.service";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { TokenData, User } from "./auth.interfaces";
import {Action, select, Store} from "@ngrx/store";
import {AuthService} from "../../auth/auth.service";
import {selectAuthState} from "./auth.selectors";

@Injectable()
export class AuthEffects {

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    switchMap(({ email, password }) =>
      this.authService.login({ email, password }).pipe(
        map(response => AuthActions.loginSuccess({
          user_id: response.user_id,
          accessToken: response.access,
          refreshToken: response.refresh
        })),
        catchError(error => of(AuthActions.loginFailure({ error })))
      )
    )
  ));

  checkStoredAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkStoredAuth),
      switchMap(() => this.authService.checkAndRefreshTokens().pipe(
        map(tokens => tokens ? AuthActions.loginSuccess({
            user_id: tokens.userId,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }) : AuthActions.logout())
      ))
    )
  );


  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      withLatestFrom(this.store.pipe(select(selectAuthState))),
      switchMap(([action, authState]) =>
        this.authService.refreshToken(authState.user_id, authState.refreshToken).pipe(
          map(({ access, refresh }) =>
            AuthActions.refreshTokenSuccess({
              tokens: { accessToken: access, refreshToken: refresh } // Wrap inside a tokens object
            })),
          catchError(error => of(AuthActions.refreshTokenFailure({ error })))
        )
      )
    )
  );


  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      // Perform any cleanup or local storage clearing here
    }),
    map(() => AuthActions.logoutSuccess())  // Dispatch a success action if needed
  ));



  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store
  ) {}
}
