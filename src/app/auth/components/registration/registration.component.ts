import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {selectIsAuthenticated} from "../../../store/auth/auth.selectors";
import {filter, tap} from "rxjs/operators";
// import {login} from "../../../store/auth/auth.actions";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit{
  registrationForm: FormGroup;
  private authSubscription: Subscription;

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password1: ['', Validators.required],
      password2: ['', Validators.required]
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
    if (this.registrationForm.valid) {
      // this.store.dispatch(login(this.loginForm.value));
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe(); // Prevent memory leaks
  }
}
