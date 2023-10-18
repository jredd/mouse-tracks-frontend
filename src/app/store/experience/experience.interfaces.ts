import {BaseInterface} from "../base.interface";
import {Location} from "../location/location.interfaces";
import {Land} from "../land/land.interfaces";

export type ExperienceType = 'attraction' | 'entertainment' | 'event' | 'restaurant' | 'dining-event' | 'dinner-show';
export type UIExperienceTypes = 'attractions' | 'entertainment' | 'events' | 'restaurants';

export interface Experience extends BaseInterface {
  name: string;
  lands: Land[];
  locations: Location[];
  destination: string;
  experience_type: ExperienceType; // Can be 'attraction', 'entertainment', 'event', 'restaurant', 'dining-event', or 'dinner-show'
}
