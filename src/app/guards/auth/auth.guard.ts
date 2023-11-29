// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
// import { AuthState } from './store/auth.reducer';
// import { selectIsAuthenticated } from './store/auth.selectors';
import { AuthState } from "../../store/auth/auth.interfaces";
import {selectIsAuthenticated} from "../../store/auth/auth.selectors";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AuthState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(selectIsAuthenticated),
      map(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']); // Redirect to the login page
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}
