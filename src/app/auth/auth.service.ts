// auth.service.ts

import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, from, Subscription, timer} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {environment} from "../../environments/environment";
import { LoginResponse, RefreshResponse, TokenData, User} from "../store";


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private readonly LOGIN_URL = `${environment.apiBaseUrl}/auth/login/`;
  private readonly REFRESH_URL = `${environment.apiBaseUrl}/auth/login/refresh/`;
  private readonly USER_STORE = 'user';
  private readonly TOKEN_STORE = 'auth';
  private refreshSubscription: Subscription;
  private refreshTokenInProgress = false;


  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService,
  ) { }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.LOGIN_URL, credentials).pipe(
      tap(response => this.storeUserAndTokens(response.user_id, response.access, response.refresh)),
      tap(response => this.scheduleTokenRefresh({userId: response.user_id, accessToken: response.access, refreshToken: response.refresh})),
      map(response => ({
        user_id: response.user_id,
        access: response.access,  // Ensure this matches the interface
        refresh: response.refresh  // Ensure this matches the interface
      })),
      catchError(error => {
        console.error(error);
        // Return a default error response that matches LoginResponse interface
        return of({
          user_id: '',
          access: '',
          refresh: ''
        });
      })
    );
  }

  refreshToken(currentUserId: string, currentRefreshToken: string): Observable<RefreshResponse> {
    if (this.refreshTokenInProgress) {
      console.log('Refresh already in progress, skipping');
      return of({ access: '', refresh: '' }); // or appropriate response
    }
    this.refreshTokenInProgress = true;
    const body = { refresh: currentRefreshToken }
    return this.http.post<RefreshResponse>(this.REFRESH_URL, body).pipe(
      tap(response => {
        // Handle token storage as a side effect
        this.refreshTokenInProgress = false;
        this.storeUserAndTokens(currentUserId, response.access, response.refresh);
      }),
      tap(response => {
        return this.scheduleTokenRefresh({
          userId: currentUserId,
          accessToken: response.access,
          refreshToken: response.refresh
        })
      }),
      map(response => ({
        access: response.access,
        refresh: response.refresh
      })),
      catchError(error => {
        this.refreshTokenInProgress = false;
        console.error('Error while refreshing:', error);
        return of({ access: '', refresh: '' }); // Return empty tokens on error
      })
    );
  }

  storeUserAndTokens(userId: string, accessToken: string, refreshToken: string): void {
    const tokenData = {
      id: 1, // Fixed user id
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken
    };
    this.dbService.getByKey(this.TOKEN_STORE, 1).subscribe((existingData) => {
      if (existingData) {
        this.dbService.update(this.TOKEN_STORE, tokenData).subscribe((_) => {
          console.log(tokenData)
          }
        );
      } else {
        this.dbService.add(this.TOKEN_STORE, tokenData).subscribe((_) =>
            console.log('Added new user and tokens')
        );
      }
    })
  }

  checkStoredTokens(): Observable<TokenData | null> {
    return this.dbService.getByKey(this.TOKEN_STORE, 1).pipe(
      map((data: any) => {
        if (data && data.user_id && data.access_token && data.refresh_token) {
          return {
            userId: data.user_id,
            accessToken: data.access_token,
            refreshToken: data.refresh_token
          };
        }
        return null; // Return null if no valid tokens are found
      }),
      catchError(error => {
        console.error('Error retrieving token info', error);
        return of(null); // Handle error by returning null
      })
    );
  }

  checkAndRefreshTokens(): Observable<TokenData | null> {
    return this.checkStoredTokens().pipe(
      switchMap(storedTokens => {
        if (!storedTokens) {
          return of(null); // No stored tokens
        }

        const isTokenExpired = this.isTokenExpired(storedTokens.accessToken);
        if (!isTokenExpired) {
          this.scheduleTokenRefresh(storedTokens)
          return of(storedTokens); // Token is still valid
        }

        // Refresh the token
        return this.refreshToken(storedTokens.userId, storedTokens.refreshToken).pipe(
          map(refreshedTokens => {
            if (refreshedTokens && refreshedTokens.access) {
              return {
                userId: storedTokens.userId,
                accessToken: refreshedTokens.access,
                refreshToken: refreshedTokens.refresh
              };
            }
            return null; // Unable to refresh tokens
          }),
          catchError(() => of(null)) // Error during token refresh
        );
      })
    );
  }


  // Helper method to check if token is expired
  isTokenExpired(accessToken: string): boolean {
    const decodedToken = this.decodeJwt(accessToken);
    if (!decodedToken || !decodedToken.exp) {
      return true; // Assume expired if the token or exp claim is not present
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime; // Check if token expiry time is in the past
  }

  decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1]; // Get the payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

      // const refreshMargin = 10 * 60 * 1000; // Refresh 10 minutes before expiry

  scheduleTokenRefresh(tokens: TokenData): void {
    const refreshMargin = 60 * 1000; // Refresh 1 minute before expiry
    // const refreshMargin = 10 * 60 * 1000; // Refresh 10 minutes before expiry
    const expiresIn = this.getTokenRemainingTime(tokens.accessToken);
    const expiresInMinutes = expiresIn / (60 * 1000); // Convert milliseconds to minutes
    const refreshTime = Math.max(expiresIn - refreshMargin, 0); // Ensure it's not negative

    console.log('Token will expire in approximately:', expiresInMinutes.toFixed(2), 'minutes');

    if (refreshTime <= 0) {
      this.refreshToken(tokens.userId, tokens.refreshToken).subscribe({
        next: refreshedTokens => {
          // Handle the successfully refreshed tokens
        },
        error: error => {
          // Handle any errors during token refresh
          console.error('Error refreshing tokens:', error);
        }
      });
      return;
    }

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); // Clear any existing subscription
    }

    this.refreshSubscription = timer(refreshTime).pipe(
      switchMap(() => this.checkAndRefreshTokens())
    ).subscribe(isSuccessful => {
      if (isSuccessful) {
        // Reschedule the refresh based on the new token
        this.checkStoredTokens().subscribe(tokens => {
          if (tokens && tokens.accessToken) {
            this.scheduleTokenRefresh(tokens);
          }
        });
      } else {
        console.log('toke refresh failed')
        // Handle token refresh failure, e.g., logout the user
      }
    });
  }

  getTokenRemainingTime(token: string): number {
    const decodedToken = this.decodeJwt(token);
    if (!decodedToken || !decodedToken.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return (decodedToken.exp - currentTime) * 1000; // Remaining time in milliseconds
  }


  private storeUser(email: string): Observable<User> {
    // Here you would retrieve user data from the server or another source
    // For now, we'll use a placeholder
    const user: User = {
      id: 'user_id',  // This should be retrieved from the server or response
      email: email,
      first_name: 'John',
      last_name: 'Doe'
    };
    return from(this.dbService.update(this.USER_STORE, user));
  }

  private removeTokens() {
    return from(this.dbService.delete(this.TOKEN_STORE, 1))
      .pipe(switchMap(() => this.dbService.delete(this.TOKEN_STORE, 'refreshToken')));
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
