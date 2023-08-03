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
    }
  ]
};
