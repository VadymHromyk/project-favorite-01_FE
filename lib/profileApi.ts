import type { UserLocationsResponse } from "@/types/profile";
import { backendApi } from "./api/api";

interface GetUserLocationsParams {
  userId: string;
  page?: number;
  limit?: number;
}

export const getUserLocations = async ({
  userId,
  page = 1,
  limit = 6,
}: GetUserLocationsParams): Promise<UserLocationsResponse> => {
  const { data } = await backendApi.get<UserLocationsResponse>(
    `/users/${encodeURIComponent(userId)}/locations`,
    {
      params: {
        page,
        limit,
      },
    },
  );
  return data;
};
