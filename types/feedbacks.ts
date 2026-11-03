export interface Feedback {
  _id: string;
  locationId?: string;
  rate: number;
  description: string;
  userName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FeedbackWithLocation extends Feedback {
  locationName: string | null;
}

export interface FeedbackRequestPayload {
  locationId: string;
  userName: string;
  rate: number;
  description: string;
}

export interface FeedbacksResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  feedbacks: Feedback[];
}
