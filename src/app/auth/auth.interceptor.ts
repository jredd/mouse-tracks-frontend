import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
// import { AppState } from '../store';
import {selectAccessToken} from "../store/auth/auth.selectors"; // Adjust the import to match your AppState

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private store: Store
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select(selectAccessToken),
      first(), // Take the first emission and complete
      switchMap(token => {
        if (token) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(authReq);
        }
        return next.handle(req);
      })
    );
  }
}
