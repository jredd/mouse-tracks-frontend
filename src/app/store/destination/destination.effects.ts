import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as DestinationActions from './destination.actions';
import { AppService } from "../../app.service";


@Injectable()
export class DestinationEffects {

  constructor(
    private actions$: Actions,
    private appService: AppService
  ) {}

  loadDestinations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DestinationActions.loadDestinations),
      mergeMap(() => this.appService.getDestinations()
        .pipe(
          map(destinations => DestinationActions.loadDestinationsSuccess({ destinations })),
          catchError(error => of(DestinationActions.loadDestinationsFailure({ error })))
        )
      )
    )
  );

  loadDestination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DestinationActions.loadDestination),
      mergeMap((action) => this.appService.getDestination(action.destId)
        .pipe(
          map(destination => DestinationActions.loadDestinationSuccess({ destination })),
          catchError(error => of(DestinationActions.loadDestinationFailure({ error })))
        )
      )
    )
  );
}
