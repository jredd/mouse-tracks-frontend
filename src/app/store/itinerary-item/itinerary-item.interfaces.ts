import {Experience} from "../experience/experience.interfaces";

export interface NewItineraryItem {
  tempId?: string; // Optional tempId for new items
  trip: string;
  notes?: string;
  activity_order: number;
  start_time?: Date;
  end_time?: Date;
  day: Date;
  activity_id: string;
  activity: Experience;
  content_type: string;
}

export interface ExistingItineraryItem extends Omit<NewItineraryItem, 'tempId'> { // Omitting the tempId as existing items don't need it
  id: string;
}

export type ItineraryItem = NewItineraryItem | ExistingItineraryItem;
