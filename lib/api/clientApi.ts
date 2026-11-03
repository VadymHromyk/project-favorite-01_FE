import { Feedback, FeedbackRequestPayload } from "@/types/feedbacks";
import type { User } from "@/types/user";
import { nextServer } from "./api";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";
import {
  GetUserLocationsParams,
  Location,
  UserLocationsResponse,
} from "@/types/location";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest): Promise<User> => {
  const { data: user } = await nextServer.post<User>("/auth/register", data);

  return user;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", data, {});

  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSessionClient = async (): Promise<boolean> => {
  try {
    const res = await nextServer.post("/auth/refresh");

    return Boolean(res.data?.success);
  } catch {
    return false;
  }
};

export const getMeClient = async (): Promise<User> => {
  const res = await nextServer.get<User>("/users/me");

  return res.data;
};

export const updateMeClient = async (formData: FormData): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", formData);

  return res.data;
};

export const createFeedback = async (
  payload: FeedbackRequestPayload,
): Promise<Feedback> => {
  const { data } = await nextServer.post<Feedback>("/feedbacks", payload);

  return data;
};

export const createLocation = async (payload: FormData): Promise<Location> => {
  const { data } = await nextServer.post<Location>("/locations", payload);

  return data;
};

export const getUserLocationsClient = async ({
  userId,
  page = 1,
  limit = 6,
}: GetUserLocationsParams): Promise<UserLocationsResponse> => {
  const res = await nextServer.get<UserLocationsResponse>(
    `/users/${encodeURIComponent(userId)}/locations`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return res.data;
};

/* ------------------------ Interceptor ------------------------ */

let refreshing: Promise<boolean> | null = null;

nextServer.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isRefreshCall = original?.url?.includes("/auth/refresh");
    const isMeCall = original?.url?.includes("/users/me");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isRefreshCall &&
      !isMeCall
    ) {
      original._retry = true;

      refreshing ??= checkSessionClient().finally(() => {
        refreshing = null;
      });

      const ok = await refreshing;
      if (ok) return nextServer(original);

      // refresh не вдався: сесія мертва
      if (useAuthStore.getState().user) {
        useAuthStore.getState().clearAuth();
        toast.error("Сесія закінчилась. Увійдіть знову");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);
