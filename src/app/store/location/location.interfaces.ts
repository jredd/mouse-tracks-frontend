import {BaseInterface} from "../base.interface";

export interface Location extends BaseInterface {
  name: string;
  location_type: string; // Can be 'resort', 'theme-park', 'water-park', or 'entertainment-venue'
  destination: string;
}
