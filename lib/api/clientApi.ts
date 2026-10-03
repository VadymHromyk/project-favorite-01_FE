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