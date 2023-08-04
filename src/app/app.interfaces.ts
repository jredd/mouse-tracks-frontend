// base.model.ts
export interface BaseModel {
  id: string;
}

export interface User {
  id: string;
  email: string;
  // last_name: string;
  // last_name: string;
}

// destination.model.ts
export interface Destination extends BaseModel {
  name: string;
}

// location.model.ts
export interface Location extends BaseModel {
  name: string;
  location_type: string; // Can be 'resort', 'theme-park', 'water-park', or 'entertainment-venue'
  destination: Destination;
}

// land.model.ts
export interface Land extends BaseModel {
  name: string;
  park: Location;
}

// experience.model.ts
export interface Experience extends BaseModel {
  name: string;
  land?: Land;
  locations: Location[];
  destination?: Destination;
  experience_type: string; // Can be 'attraction', 'entertainment', 'event', 'restaurant', 'dining-event', or 'dinner-show'
}
