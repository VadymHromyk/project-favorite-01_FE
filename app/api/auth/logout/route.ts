import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, ApiError } from "../../api";

export async function POST() {
  const cookieStore = await cookies();
  try {
    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );
  } catch (error) {
    console.error("logout error:", error);
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("sessionId");

  return NextResponse.json({
    message: "Ви успішно вийшли з облікового запису.",
  });
}
