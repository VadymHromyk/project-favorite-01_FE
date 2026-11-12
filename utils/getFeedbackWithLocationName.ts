import { Feedback, FeedbackWithLocation } from "@/types/feedbacks";
import { Location } from "@/types/location";

function toLocationId(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && value !== null && "_id" in value) {
    const id = (value as { _id?: unknown })._id;
    return typeof id === "string" ? id : null;
  }
  return null;
}

export default function getFeedbackWithLocationName(
  feedbacks: Feedback[] = [],
  locations: Location[] = [],
): FeedbackWithLocation[] {
  const locationMap = new Map<string, string>();

  for (const loc of locations) {
    if (loc._id && loc.name) {
      locationMap.set(String(loc._id), loc.name);
    }
  }

  return feedbacks.map((feedback) => {
    const locId = toLocationId(feedback.locationId);
    const locationName = locId ? (locationMap.get(locId) ?? null) : null;

    return {
      ...feedback,
      locationName,
    };
  });
}
