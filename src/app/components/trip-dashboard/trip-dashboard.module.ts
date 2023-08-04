import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {TripDashboardComponent} from "./trip-dashboard.component";
import {TripPlannerComponent} from "../trip-planner/trip-planner.component";
import {RouterModule} from "@angular/router";
import {MatGridListModule} from "@angular/material/grid-list";
import {MomentDateModule} from "@angular/material-moment-adapter";
import {MatButtonToggleGroup, MatButtonToggleModule} from "@angular/material/button-toggle";
import {ItineraryComponent} from "../itinerary/itinerary.component";

@NgModule({
  declarations: [
    TripDashboardComponent,
    TripPlannerComponent,
    ItineraryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    RouterModule
  ],
  exports: [TripDashboardComponent]
})
export class TripDashboardModule { }
