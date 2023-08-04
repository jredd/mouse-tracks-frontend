import { Component } from '@angular/core';
import {MatButtonToggleChange} from "@angular/material/button-toggle";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent {
  experienceTypes = ["Attractions", "Entertainment", "Event"]

  onExperienceTypeChange(event: MatButtonToggleChange) {
    console.log(event.value); // prints the selected experience type
  }
}
