import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripDashboardComponent } from "./components/trip-dashboard/trip-dashboard.component";
import { TripPlannerComponent } from "./components/trip-planner/trip-planner.component";
import { currentTripGuard, deactivateCurrentTripGuard } from "./guards/current-trip.guard";
import { TripDetailComponent } from "./components/trip-detail/trip-detail.component";


const routes: Routes = [
  {
    path: '', component: TripDashboardComponent,
  },
  {
    path: 'trip',
    children: [
      { path: '', component: TripDashboardComponent },
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
      // ... more trip-related routes here
    ]
  },
  // {
  //   path: 'settings',
  //   children: [
  //     { path: 'profile', component: UserProfileComponent },
  //     { path: 'notifications', component: UserNotificationsComponent }
  //     // ... more settings-related routes here
  //   ]
  // },
  // {
  //   path: 'user',
  //   children: [
  //     { path: 'login', component: LoginComponent },
  //     { path: 'register', component: RegisterComponent }
  //     // ... more user-related routes here
  //   ]
  // },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
