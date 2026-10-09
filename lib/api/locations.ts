import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export interface LocationOwner {
  _id: string;
  name: string;
}

export interface Location {
  _id: string;
  name: string;
  locationType: string;
  // older records may still have the field under this name
  type?: string;
  region: string;
  description: string;
  image: string;
  rate?: number;
  coordinates?: { lat?: number; lon?: number };
  ownerId: string | LocationOwner;
  feedbacksId: string[];
}
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://project-favorite-01-be.onrender.com/api";

// own instance with its own refresh logic: the shared interceptor also retries /auth/refresh itself
const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

const REFRESH_URL = "/auth/refresh";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// parallel 401 responses wait for the same refresh request
let refreshPromise: Promise<unknown> | null = null;

const refreshSession = () => {
  refreshPromise ??= api.post(REFRESH_URL).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const canRetry =
      error.response?.status === 401 &&
      config !== undefined &&
      !config._retry &&
      config.url !== REFRESH_URL;
    if (!canRetry) return Promise.reject(error);

    config._retry = true;
    try {
      await refreshSession();
    } catch {
      // refresh failed: keep the original 401 so the form asks to log in
      return Promise.reject(error);
    }
    return api(config);
  },
);

export const createLocation = async (formData: FormData) => {
  const { data } = await api.post<Location>("/locations", formData);
  return data;
};

export const getLocationById = async (id: string) => {
  const { data } = await api.get<Location>(
    `/locations/${encodeURIComponent(id)}`,
  );
  return data;
};

export const updateLocation = async (id: string, formData: FormData) => {
  const { data } = await api.patch<Location>(
    `/locations/${encodeURIComponent(id)}`,
    formData,
  );
  return data;
};
