import { cache } from "react";
import { getLocations } from "@/lib/locationsApi";
import type { Location } from "@/types/profile";

export const getAllLocations = cache(async (): Promise<Location[]> => {
  let page = 1;
  let totalPages = 1;
  const allLocations: Location[] = [];

  try {
    do {
      const response = await getLocations({
        page,
        limit: 100,
        sort: "popular",
      });

      if (!response || !Array.isArray(response.locations)) {
        break;
      }

      allLocations.push(...response.locations);
      totalPages = response.totalPages || 1;
      page += 1;
    } while (page <= totalPages);

    return allLocations;
  } catch (error) {
    console.error("Помилка завантаження всіх локацій:", error);
    return allLocations;
  }
});
