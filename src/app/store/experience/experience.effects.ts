// experience.effects.ts
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';

import { AppService } from "../../app.service";
import * as ExperienceActions from './experience.actions';

@Injectable()
export class ExperienceEffects {

  constructor(
    private actions$: Actions,
    private appService: AppService
  ) {}

  loadExperiences$ = createEffect(() => this.actions$.pipe(
    ofType(ExperienceActions.loadExperiences),
    tap(() => ExperienceActions.setLoading({ isLoading: true })),  // set loading to true at the beginning
    mergeMap(action => this.appService.getExperiences(action.loc_id)
      .pipe(
        map(experiences => {
          ExperienceActions.setLoading({ isLoading: false });  // reset loading to false once we get data
          return ExperienceActions.setExperiences({ experiences });
        }),
        catchError(error => {
          ExperienceActions.setLoading({ isLoading: false });  // reset loading to false if there's an error
          return of(ExperienceActions.setError({ error }));   // Handle the error
        })
      ))
    )
  )
}
