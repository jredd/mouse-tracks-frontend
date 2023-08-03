export interface BaseModel {
  id: string;
  // We don't need date_created, date_updated, and is_deleted here as they are not returned by the API.
}

export interface Destination extends BaseModel {
  name: string;
}

export interface Location extends BaseModel {
  name: string;
  location_type: string; // You might want to create an enum for location types.
  destination: string; // This assumes that destination is returned as an id. If it's an object, use Destination.
}

export interface Land extends BaseModel {
  name: string;
  park: string; // This assumes that park is returned as an id. If it's an object, use Location.
}

export interface Experience extends BaseModel {
  name: string;
  experience_type: string; // You might want to create an enum for experience types.
  land: string | null; // This assumes that land is returned as an id. If it's an object, use Land.
  locations: string[]; // This assumes that locations are returned as ids. If they are objects, use Location[].
  destination: string | null; // This assumes that destination is returned as an id. If it's an object, use Destination.
}
