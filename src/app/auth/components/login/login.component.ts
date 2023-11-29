import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { login } from "../../../store/auth/auth.actions";
import { filter, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { selectIsAuthenticated } from "../../../store/auth/auth.selectors";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  loginForm: FormGroup;
  private authSubscription: Subscription;

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['rmyeselson@gmail.com', [Validators.required, Validators.email]],
      password: ['r87835046', Validators.required]
    });

    this.authSubscription = this.store.pipe(
      select(selectIsAuthenticated),
      filter(isAuthenticated => isAuthenticated),
      tap(() => {
        // console.log('Authenticated, navigating to /');
        this.router.navigate(['']);
      })
    ).subscribe();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.store.dispatch(login(this.loginForm.value));
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe(); // Prevent memory leaks
  }
}
