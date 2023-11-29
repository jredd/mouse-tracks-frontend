import { Experience} from "../experience/experience.interfaces";
import { BaseInterface } from "../base.interface";
import {Trip} from "../trip/trip.interfaces";
import {Location} from "../location/location.interfaces";

export interface TravelEvent extends BaseInterface {
  from_location: Location;
  from_location_id: string;
  to_location: Location;
  to_location_id: string;
  custom_from_location?: string;
  custom_to_location?: string;
  travel_type: string;
}

export interface Break extends BaseInterface {
  location: Location;
}

export interface Meal extends BaseInterface {
  meal_experience: Experience;
  meal_type: string;
}

export interface MealAPI extends BaseInterface {
  meal_experience_id: string;
  meal_experience: string;
  meal_type: string;
}

export type ContentType = 'meal' | 'note' | 'travelevent' | 'break' | 'experience';

export interface NewItineraryItem {
  tempId: string; // Optional tempId for new items
  trip: string;
  notes?: string;
  activity_order: number;
  start_time?: Date;
  end_time?: Date; // we probably don't need the endtime column
  day: Date;
  activity_id?: string;
  activity?: Experience | Break | Meal | TravelEvent;
  content_type: ContentType;
  attributes: any;
}

export interface ExistingItineraryItem extends Omit<NewItineraryItem, 'tempId'> { // Omitting the tempId as existing items don't need it
  id: string;
}

export type ItineraryItem = NewItineraryItem | ExistingItineraryItem;

export interface APIItineraryItem extends Omit<NewItineraryItem, 'tempId' | 'day' | 'trip'> {
  day: string;
  trip: string;
}
