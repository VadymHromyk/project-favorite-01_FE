export interface LocationOwner {
  _id: string;
  name: string;
}

export interface RegionInfo {
  _id: string;
  region: string;
  slug: string;
  level: "регіональне" | "обласне" | "локальне" | string;
  note?: string;
}

export interface LocationTypeInfo {
  _id: string;
  type: string;
  slug: string;
  shortDescription?: string;
}

export interface Location {
  _id: string;
  name: string;
  locationType: string;
  region: string;
  image?: string | null;
  description?: string;

  coordinates?: {
    lat: number;
    lon: number;
  } | null;

  rate?: number;
  feedbacksId?: string[];
  regionInfo?: RegionInfo;
  locationTypeInfo?: LocationTypeInfo;

  ownerId?: LocationOwner | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationsResponse {
  page: number;
  perPage: number;
  totalLocations: number;
  totalPages: number;
  locations: Location[];
}

export interface GetUserLocationsParams {
  userId: string;
  page?: number;
  limit?: number;
}

export interface UserLocationsResponse {
  data: Location[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// export interface LocationsResponse {
//   page: number;
//   perPage: number;
//   totalLocations: number;
//   totalPages: number;
//   locations: Location[];
// }

// export interface Location {
//   _id: string;
//   name: string;
//   locationType: string;
//   region: string;
//   image: string;
//   description?: string;
//   coordinates?: {
//     lat: number;
//     lon: number;
//   };
//   rate?: number;
//   rating?: number;
//   feedbacksId?: string[];
//   ownerId?: string;
//   createdAt: string;
// }
