import { Component, OnInit } from '@angular/core';
import {TripService} from "../trip-dashboard/trip-dashboard.service";
import {Trip} from "../trip-dashboard/trip-dashboard.interfaces";
import {AppService} from "../../app.service";
import {Destination} from "../../app.interfaces";
import {ActivatedRoute} from "@angular/router";
import {FormGroup, FormControl, FormBuilder} from '@angular/forms';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-trip-planner',
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.scss'],
})
export class TripPlannerComponent implements OnInit {

  fb: FormBuilder;
  editTrip: FormGroup
  trip?: Trip;
  tripId?: string | null;
  destinations: Destination[] = [];

  constructor(private route: ActivatedRoute, private tripService: TripService, private appService: AppService, fb: FormBuilder,) {
    this.fb = fb;
    this.editTrip = this.fb.group({
    title: new FormControl('', Validators.required),
    destination: new FormControl('', Validators.required),
    dateRange: new FormGroup({
        start: new FormControl('', Validators.required),
        end: new FormControl('', Validators.required)
    })
  });

  }

  ngOnInit(): void {
    this.tripId = this.route.snapshot.paramMap.get('id');
    this.getDestinations();
    if (this.tripId) {
      this.tripService.getTrip(this.tripId).subscribe(trip => {
        this.trip = trip;
        this.editTrip.setValue({
          title: trip.title,
          destination: trip.destination,  // assuming 'id' is the correct property of Destination
          dateRange: {
            start: trip.start_date,
            end: trip.end_date
          }
        });
        this.editTrip.get('destination')?.disable();
      });
    }
  }

  getDestinations(): void {
    this.appService.getDestinations().subscribe(destinations => this.destinations = destinations);
  }

  updateTrip(trip: Trip) {
    if (this.tripId) {
        this.tripService.updateTrip(this.tripId, trip).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  createTrip(tripData: Partial<Trip>) {
    this.tripService.createTrip(tripData).subscribe(response => {
        console.log(response);
        this.tripId = response.id
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    console.log('trutesl');
    if (this.editTrip.valid) {
      if (this.tripId) {
        const trip = this.prepareUpdateFormData()
        if (trip) {
          this.updateTrip(trip)
        } else {
          console.log('shit hit the fan')
        }
      } else {
        this.createTrip(this.prepareCreateFormData())
      }
    }
  }

  private formatDate(date: Date): string {
    // Here you would convert your Date object to the format that your API expects.
    // This is just an example, replace it with your actual date formatting logic.
    return date.toISOString().slice(0,10);  // returns YYYY-MM-DD
  }

  prepareUpdateFormData(): Trip | null {
    if (this.trip) {
      const formData = this.editTrip.value;
      this.trip.title = formData.title
      this.trip.destination = formData.destination
      this.trip.start_date = formData.value.start.toDateString()
      this.trip.end_date = formData.value.end.toDateString()
      return this.trip
    }
    return null
  }

  private prepareCreateFormData(): Partial<Trip> {
    const formData = this.editTrip.value;
    console.log(formData.dateRange.start)
    return {
      title: formData.title,
      created_by: 'a56ea5a9-2101-4df9-8d39-9fd762c8e11f',
      destination: formData.destination,
      start_date: this.formatDate(formData.dateRange.start),
      end_date: this.formatDate(formData.dateRange.end)
    };
  }
}
