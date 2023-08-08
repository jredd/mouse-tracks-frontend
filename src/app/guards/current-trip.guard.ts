import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as tripActions from '../store/trip/trip.actions';


export const currentTripGuard = (next: ActivatedRouteSnapshot) => {
    const store = inject(Store);
    const router = inject(Router);
    const tripId = next.params['id'];

    if (tripId) {
        store.dispatch(tripActions.setCurrentTrip({ trip_id: tripId }));
    }

  return true;
};

export const deactivateCurrentTripGuard = () => {
    const store = inject(Store);

    store.dispatch(tripActions.deactivateCurrentTrip());
    return true;
};
