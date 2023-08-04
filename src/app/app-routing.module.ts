import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TripDashboardComponent} from "./components/trip-dashboard/trip-dashboard.component";
import {TripPlannerComponent} from "./components/trip-planner/trip-planner.component";

const routes: Routes = [
  { path: '', component: TripDashboardComponent },
  { path: 'trip-planner', component: TripPlannerComponent },
  { path: 'trip-planner/:id', component: TripPlannerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
