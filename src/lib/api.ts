import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://project-favorite-01-be.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AUTH_ENDPOINTS = [
  "/auth/refresh",
  "/auth/logout",
  "/auth/login",
  "/auth/register",
];

const isAuthEndpoint = (url?: string): boolean =>
  Boolean(url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint)));

let refreshPromise: Promise<unknown> | null = null;

let isForcedLogout = false;

const forceLogout = (): void => {
  if (typeof window === "undefined" || isForcedLogout) return;

  if (!useAuthStore.getState().isLoggedIn) return;

  isForcedLogout = true;

  useAuthStore.getState().clearAuth();
  useAuthStore.persist.clearStorage();

  const { pathname } = window.location;
  if (pathname !== "/login" && pathname !== "/register") {
    window.location.href = "/login";
  } else {
    isForcedLogout = false;
  }
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh").finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;

      return api(originalRequest);
    } catch (refreshError) {
      forceLogout();
      return Promise.reject(refreshError);
    }
  },
);