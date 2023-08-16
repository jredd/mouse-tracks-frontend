import {BaseInterface} from "../base.interface";
import {Location} from "../location/location.interfaces";

export type ExperienceType = 'attraction' | 'entertainment' | 'event' | 'restaurant' | 'dining-event' | 'dinner-show';
export type UIExperienceTypes = 'attractions' | 'entertainment' | 'events' | 'restaurants';

export interface Experience extends BaseInterface {
  name: string;
  land: string | null;
  locations: Location[];
  destination: string;
  experience_type: ExperienceType; // Can be 'attraction', 'entertainment', 'event', 'restaurant', 'dining-event', or 'dinner-show'
}
