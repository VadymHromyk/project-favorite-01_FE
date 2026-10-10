import { User } from "@/types/user";
import { cookies } from "next/headers";
import { backendApi } from "./api";

export const checkServerSession = async () => {
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
    return Boolean(res.data?.message);
  } catch {
    return false;
  }
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const res = await backendApi.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
};
