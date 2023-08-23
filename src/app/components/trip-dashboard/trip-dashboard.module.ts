import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { ItineraryPlannerComponent } from "../itinerary-planner/itinerary-planner.component";
import { TripDashboardComponent } from "./trip-dashboard.component";
import { TripPlannerComponent } from "../trip-planner/trip-planner.component";
import { DayPlannerComponent } from "../day-planner/day-planner.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatIconModule } from "@angular/material/icon";
import { TripDetailComponent } from "../trip-detail/trip-detail.component";
import { DayDetailComponent } from "../day-detail/day-detail.component";
import { ItineraryDetailComponent } from "../itinerary-detail/itinerary-detail.component";
import { MatDividerModule } from "@angular/material/divider";
import { DayNamePipe} from "../../pipes/day-name.pipe";
import { MatDialogModule} from "@angular/material/dialog";
import { DialoguePlannerContentComponent } from "../dialogue-planner-content/dialogue-planner-content.component";


@NgModule({
  declarations: [
    TripDashboardComponent,
    TripPlannerComponent,
    TripDetailComponent,
    ItineraryPlannerComponent,
    DateRangePipe,
    DayNamePipe,
    DayPlannerComponent,
    DayDetailComponent,
    ItineraryDetailComponent,
    DialoguePlannerContentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    FormsModule,
    RouterModule,
  ],
  exports: [TripDashboardComponent, DateRangePipe]
})
export class TripDashboardModule { }
