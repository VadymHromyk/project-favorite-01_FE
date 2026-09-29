export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  articlesAmount: number;
  createdAt: string;
}

export interface LocationsResponse {
  page: number;
  perPage: number;
  totalLocations: number;
  totalPages: number;
  locations: Location[];
}
