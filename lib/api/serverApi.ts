import { User, UserProfileResponse } from "@/types/user";
import { cookies } from "next/headers";
import { backendApi } from "./api";
import { FeedbacksResponse } from "@/types/feedbacks";

export const checkSessionServer = async () => {
  const cookieStore = await cookies();

  try {
    const res = await backendApi.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    return res;
  } catch (error: any) {
    if (!error?.response) throw error;
    return;
  }
};

export const getMeServer = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  try {
    const res = await backendApi.get<UserProfileResponse>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return res.data.data;
  } catch {
    return null; // без цього буде undefined
  }
};

export const getUserByIdServer = async (userId: string): Promise<User> => {
  const cookieStore = await cookies();
  const res = await backendApi.get<UserProfileResponse>(`/users/${userId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data.data;
};

export const getFeedbacksServer = async (
  locationId: string,
  page = 1,
  limit = 20,
): Promise<FeedbacksResponse> => {
  const res = await backendApi.get<FeedbacksResponse>(`/feedbacks`, {
    params: {
      locationId,
      page,
      limit,
    },
  });

  return res.data;
};
