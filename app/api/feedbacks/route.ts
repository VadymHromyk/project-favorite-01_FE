import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cookieStore = await cookies();

    const res = await api.post("/feedbacks", body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).status },
    );
  }
}
