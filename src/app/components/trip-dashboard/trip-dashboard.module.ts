import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from "@angular/router";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { DateRangePipe } from "../../pipes/date-range.pipe";
import { ItineraryComponent } from "../itinerary/itinerary.component";
import { TripDashboardComponent } from "./trip-dashboard.component";
import { TripPlannerComponent } from "../trip-planner/trip-planner.component";
import {DayPlannerComponent} from "../day-planner/day-planner.component";
import {DragDropModule} from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    TripDashboardComponent,
    TripPlannerComponent,
    ItineraryComponent,
    DateRangePipe,
    DayPlannerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatCardModule,
    DragDropModule,
    RouterModule,
  ],
  exports: [TripDashboardComponent, DateRangePipe]
})
export class TripDashboardModule { }
