import {BaseInterface} from "../base.interface";
import {Destination} from "../destination/destination.interfaces";
// TODO: setup the interface to be similar to the itinerary interfaces
export interface Trip extends BaseInterface {
  title: string;
  created_by: string;
  destination_id?: string;
  destination: Destination
  start_date: Date;
  end_date: Date;
  last_content_update: Date;
}

export interface ApiTrip {
  title?: string;
  created_by?: string;
  destination_id?: string;
  destination?: Destination;
  last_content_update?: Date;
  start_date: string;
  end_date: string;
  id?: string;
}
