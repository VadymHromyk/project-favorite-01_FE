import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIES = ["accessToken", "sessionId"];

export const getAuthCookieHeader = async () => {
  const cookieStore = await cookies();

  return AUTH_COOKIES.map((name) => cookieStore.get(name))
    .filter((cookie) => cookie !== undefined)
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
};

export const proxyToBackend = async (path: string, init: RequestInit = {}) => {
  const baseUrl = process.env.BACKEND_API_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "BACKEND_API_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      cache: "no-store",
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to connect to the server" },
      { status: 500 },
    );
  }
};
