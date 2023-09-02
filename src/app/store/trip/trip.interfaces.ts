import {BaseInterface} from "../base.interface";
import {Destination} from "../destination/destination.interfaces";
// TODO: setup the interface to be similar to the itinerary interfaces
export interface Trip extends BaseInterface {
  title: string;
  created_by: string;
  destination_id?: string;
  destination: Destination
  start_date: string;
  end_date: string;
  last_content_update: string;
}

export interface ApiTrip {
  title?: string;
  created_by?: string;
  destination_id?: string;
  destination?: Destination;
  last_content_update?: string;
  start_date: string;
  end_date: string;
  id?: string;
}
