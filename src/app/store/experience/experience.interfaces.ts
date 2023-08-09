import {BaseInterface} from "../base.interface";
import {Location} from "../location/location.interfaces";

export interface Experience extends BaseInterface {
  name: string;
  land: string | null;
  locations: Location[];
  destination: string;
  experience_type: string; // Can be 'attraction', 'entertainment', 'event', 'restaurant', 'dining-event', or 'dinner-show'
}
