import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TripDashboardComponent } from "./trip-dashboard.component";
import { TripPlannerComponent } from "../trip-planner/trip-planner.component";
import { RouterModule } from "@angular/router";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ItineraryComponent } from "../itinerary/itinerary.component";
import { MatCardModule } from "@angular/material/card";
import { DateRangePipe } from "../../pipes/date-range.pipe";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    TripDashboardComponent,
    TripPlannerComponent,
    ItineraryComponent,
    DateRangePipe,
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
    RouterModule,
  ],
  exports: [TripDashboardComponent, DateRangePipe]
})
export class TripDashboardModule { }
