import PopularLocationsBlock from "./PopularLocationsBlock";
import { getAllLocations } from "@/utils/getAllLocations";
import { getLocationTypes } from "@/lib/locationsApi";
import { normalizeLocationsByType } from "@/utils/getLocationsWithNormalizedTypes";
import { Location } from "@/types/profile";

export default async function PopularSection() {
  let locationsWithRating: Location[] = [];

  try {
    const [locations, locationTypes] = await Promise.all([
      getAllLocations(),
      getLocationTypes(),
    ]);

    locationsWithRating = normalizeLocationsByType(
      locations || [],
      locationTypes || [],
    );
  } catch (error) {
    console.error("Помилка завантаження популярних локацій:", error);
    locationsWithRating = [];
  }

  return <PopularLocationsBlock locations={locationsWithRating} />;
}
