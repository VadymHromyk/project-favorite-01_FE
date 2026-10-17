import axios from "axios";
import { Feedback, FeedbacksResponse } from "@/types/feedbacks";
import type { Location } from "@/types/profile";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://project-favorite-01-be.onrender.com";

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const privateApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface AddFeedbackPayload {
  locationId: string;
  userName: string;
  rate: number;
  description: string;
}

export async function getFeedbacks(
  locationId: string,
  page = 1,
  limit = 20,
): Promise<FeedbacksResponse> {
  const { data } = await publicApi.get<FeedbacksResponse>("/feedbacks", {
    params: {
      locationId,
      page,
      limit,
    },
  });

  return data;
}

export async function getAllFeedbacksSorted(
  locations: Location[],
): Promise<Feedback[]> {
  if (!locations || locations.length === 0) {
    return [];
  }

  const validLocations = locations.filter((loc) => loc._id);

  const results = await Promise.allSettled(
    validLocations.map((loc) => getFeedbacks(loc._id, 1, 50)),
  );

  const allFeedbacks: Feedback[] = [];

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      const val = result.value as unknown as Record<string, unknown>;

      let items: Feedback[] = [];
      if (Array.isArray(val.feedbacks)) items = val.feedbacks as Feedback[];
      else if (Array.isArray(val.data)) items = val.data as Feedback[];
      else if (Array.isArray(val.result)) items = val.result as Feedback[];
      else if (Array.isArray(val)) items = val as unknown as Feedback[];

      if (items.length > 0) {
        allFeedbacks.push(...items);
      }
    }
  }

  const uniqueFeedbacksMap = new Map<string, Feedback>();
  for (const fb of allFeedbacks) {
    if (fb._id) {
      uniqueFeedbacksMap.set(fb._id, fb);
    }
  }

  return Array.from(uniqueFeedbacksMap.values()).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}
