// trip.model.ts
import {Destination, Experience, User} from "../../app.interfaces";

export interface BaseModel {
  id: string | null;
  // other common properties, if any
}

export interface Trip extends BaseModel {
  title: string;
  created_by: string;
  destination: string;
  start_date: string;
  end_date: string;
  last_content_update: string;
}

// break.model.ts
export interface Break extends BaseModel {
  location: Location;
}

// travel-event.model.ts
export interface TravelEvent extends BaseModel {
  from_location?: Location;
  to_location?: Location;
  custom_from_location?: string;
  custom_to_location?: string;
  travel_type: string;
}

// meal.model.ts
export interface Meal extends BaseModel {
  meal_experience: Experience;
  meal_type: string;
}

export interface ContentType {
  app_label: string;
  model: string;
}

// itinerary-item.model.ts
export interface ItineraryItem extends BaseModel {
  trip: Trip;
  notes?: string;
  activity_order: number;
  start_time?: string; // Time in HH:MM:SS format
  end_time?: string; // Time in HH:MM:SS format
  day: string; // Date in YYYY-MM-DD format
  activity_id: number;
  content_type: ContentType;
  activity: any; // This could be any of the other models (Trip, Break, TravelEvent, Meal)
}
