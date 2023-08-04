import { Component, OnInit } from '@angular/core';
import { Trip } from "./trip-dashboard.interfaces";
import { TripService } from './trip-dashboard.service';

@Component({
  selector: 'app-trip-dashboard',
  templateUrl: './trip-dashboard.component.html',
  styleUrls: ['./trip-dashboard.component.scss']
})
export class TripDashboardComponent implements OnInit {
  trips: Trip[] = []; // Array to store the trips
  tiles = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
  constructor(private tripService: TripService) { }

  ngOnInit() {
    this.tripService.getTrips().subscribe((data: Trip[]) => {
      this.trips = data;
    });
  }

  protected readonly length = length;
}
