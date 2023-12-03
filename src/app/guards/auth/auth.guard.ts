import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import { Store, select } from '@ngrx/store';
import {selectIsAuthenticated} from "../../store/auth/auth.selectors";
import {map} from "rxjs/operators";

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.pipe(
    select(selectIsAuthenticated),
    map(authenticated => {
      if (!authenticated) {
        router.navigate(['/auth/login']); // Redirect to the login page
        return false;
      }
      return true;
    }),
  );
};
