import {
  LOCATION_TYPES,
  REGIONS,
  type SelectOption,
} from "@/lib/constants/locationOptions";

interface CategoriesResponse {
  regions: { slug: string; region: string }[];
  locationTypes: { slug: string; type: string }[];
}

export interface LocationFormOptions {
  typeOptions: SelectOption[];
  regionOptions: SelectOption[];
}

const FALLBACK_OPTIONS: LocationFormOptions = {
  typeOptions: LOCATION_TYPES,
  regionOptions: REGIONS,
};

// falls back to the local lists so the form keeps working if the request fails
export const getLocationFormOptions =
  async (): Promise<LocationFormOptions> => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/api/categories`,
        { next: { revalidate: 3600 } },
      );
      if (!response.ok) return FALLBACK_OPTIONS;

      const { regions, locationTypes }: CategoriesResponse =
        await response.json();
      const typeOptions = locationTypes.map(({ slug, type }) => ({
        value: slug,
        label: type,
      }));
      const regionOptions = regions.map(({ slug, region }) => ({
        value: slug,
        label: region,
      }));

      return {
        typeOptions: typeOptions.length ? typeOptions : LOCATION_TYPES,
        regionOptions: regionOptions.length ? regionOptions : REGIONS,
      };
    } catch {
      return FALLBACK_OPTIONS;
    }
  };
