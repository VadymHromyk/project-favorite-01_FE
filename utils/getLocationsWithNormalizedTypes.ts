import { Location } from "@/types/profile";

export type LocationTypeItem = {
  _id?: string;
  id?: string;
  slug?: string;
  type?: string;
  name?: string;
  shortDescription?: string;
};

export function normalizeLocationsByType(
  locations: Location[] = [],
  locationTypes: LocationTypeItem[] = [],
): Location[] {
  if (!Array.isArray(locations) || locations.length === 0) {
    return [];
  }

  const map = (Array.isArray(locationTypes) ? locationTypes : []).reduce<
    Record<string, string>
  >((acc, item) => {
    const key = item?.slug || item?._id || item?.id;
    const value = item?.type || item?.name;
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return locations.map((location) => {
    const rawLoc = location as unknown as Record<string, unknown>;

    const actualRate = Number(
      location.rate ??
        location.rating ??
        rawLoc.avgRating ??
        rawLoc.averageRating ??
        0,
    );

    return {
      ...location,
      rate: actualRate,
      rating: actualRate,
      locationType:
        map[location.locationType] ?? location.locationType ?? "Локація",
    };
  });
}
