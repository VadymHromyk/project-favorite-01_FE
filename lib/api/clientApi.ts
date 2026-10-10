import { nextServer } from "./api";
import type { User } from "@/types/user";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest): Promise<User> => {
  const { data: user } = await nextServer.post<User>("/auth/register", data);

  return user;
};

export const login = async (data: RegisterRequest): Promise<User> => {
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
