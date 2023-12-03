import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripDashboardComponent } from "./components/trip-dashboard/trip-dashboard.component";
import { TripPlannerComponent } from "./components/trip-planner/trip-planner.component";
import { currentTripGuard, deactivateCurrentTripGuard } from "./guards/current-trip.guard";
import { TripDetailComponent } from "./components/trip-detail/trip-detail.component";
import { authGuard } from "./guards/auth/auth.guard";
import { LoginComponent } from "./auth/components/login/login.component";
import {RegistrationComponent} from "./auth/components/registration/registration.component";


const routes: Routes = [
  {
    path: 'auth/login', component: LoginComponent
  },
  {
    path: 'auth/register', component: RegistrationComponent
  },
  {
    path: '', component: TripDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'trip',
    canActivate: [authGuard],
    children: [
      {
        path: 'planner',
        component: TripPlannerComponent,
        canDeactivate: [deactivateCurrentTripGuard]
      },
      {
        path: 'planner/:id',
        component: TripPlannerComponent,
        canActivate: [currentTripGuard],
        canDeactivate: [deactivateCurrentTripGuard]
      },
      {
        path: 'detail/:id',
        component: TripDetailComponent,
        canActivate: [currentTripGuard],
        canDeactivate: [deactivateCurrentTripGuard]
      }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
