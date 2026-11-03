import ReviewsBlock from "./ReviewsBlock";
import { getAllLocations } from "@/utils/getAllLocations";
import getFeedbackWithLocationName from "@/utils/getFeedbackWithLocationName";
import type { Feedback, FeedbackWithLocation } from "@/types/feedbacks";
import { getFeedbacksServer } from "@/lib/api/serverApi";
import { Location } from "@/types/location";

export const revalidate = 60;

export async function getAllFeedbacksSorted(
  locations: Location[],
): Promise<Feedback[]> {
  if (!locations || locations.length === 0) {
    return [];
  }

  const validLocations = locations.filter((loc) => loc._id);

  const results = await Promise.allSettled(
    validLocations.map((loc) => getFeedbacksServer(loc._id, 1, 50)),
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

export default async function FeedbacksSection() {
  let normalizedFeedbacks: FeedbackWithLocation[] = [];

  try {
    const locations = await getAllLocations();
    const feedbacks = await getAllFeedbacksSorted(locations);
    normalizedFeedbacks = getFeedbackWithLocationName(
      feedbacks || [],
      locations || [],
    );
  } catch (error) {
    console.error("Помилка завантаження відгуків:", error);
  }

  return <ReviewsBlock feedbacks={normalizedFeedbacks} />;
}
