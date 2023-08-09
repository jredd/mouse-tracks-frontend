import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';

import * as locationActions from './location.actions';
import { AppService } from "../../app.service";


@Injectable()
export class LocationEffects {
  constructor(private actions$: Actions, private appService: AppService) {}

  loadLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(locationActions.loadLocations),
      mergeMap((action) =>
        this.appService.getLocations(action.dest_id).pipe(
          map((locations) => locationActions.loadLocationsSuccess({ locations })),
          catchError((error) => [locationActions.loadLocationsFailure({ error })])
        )
      )
    )
  );
}
