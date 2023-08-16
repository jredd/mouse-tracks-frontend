import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'MouseTracksDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'destination',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
      ]
    },
    {
      store: 'location',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'location_type', keypath: 'location_type', options: { unique: false } },
        { name: 'destination_id', keypath: 'destination_id', options: { unique: false } },
        // Additional fields as needed
      ]
    },
    {
      store: 'land',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'park_id', keypath: 'park_id', options: { unique: false } },
        // Additional fields as needed
      ]
    },
    {
      store: 'experience',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'experience_type', keypath: 'experience_type', options: { unique: false } },
        { name: 'land_id', keypath: 'land_id', options: { unique: false } },
        // Additional fields as needed
      ]
    },
    {
      store: 'trip',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'created_by', keypath: 'created_by', options: { unique: false } },
        { name: 'destination', keypath: 'destination', options: { unique: false } },
        { name: 'start_date', keypath: 'start_date', options: { unique: false } },
        { name: 'end_date', keypath: 'end_date', options: { unique: false } },
        { name: 'last_content_update', keypath: 'last_content_update', options: { unique: false } },
      ]
    },
    {
      store: 'break',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'location', keypath: 'location', options: { unique: false } },
      ]
    },
    {
      store: 'travel_event',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'from_location', keypath: 'from_location', options: { unique: false } },
        { name: 'to_location', keypath: 'to_location', options: { unique: false } },
        { name: 'custom_from_location', keypath: 'custom_from_location', options: { unique: false } },
        { name: 'custom_to_location', keypath: 'custom_to_location', options: { unique: false } },
        { name: 'travel_type', keypath: 'travel_type', options: { unique: false } },
      ]
    },
    {
      store: 'meal',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'meal_experience', keypath: 'meal_experience', options: { unique: false } },
        { name: 'meal_type', keypath: 'meal_type', options: { unique: false } },
      ]
    },
    {
      store: 'itinerary_item',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'trip', keypath: 'trip', options: { unique: false } },
        { name: 'notes', keypath: 'notes', options: { unique: false } },
        { name: 'activity_order', keypath: 'activity_order', options: { unique: false } },
        { name: 'start_time', keypath: 'start_time', options: { unique: false } },
        { name: 'end_time', keypath: 'end_time', options: { unique: false } },
        { name: 'day', keypath: 'day', options: { unique: false } },
        { name: 'activity_id', keypath: 'activity_id', options: { unique: false } },
        { name: 'content_type', keypath: 'content_type', options: { unique: false } },
      ]
    }
  ]
};
