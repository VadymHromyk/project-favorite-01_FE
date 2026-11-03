import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, ApiError } from "@/app/api/api";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { userId } = await params;

  try {
    const { data } = await api.get(`/users/${userId}/locations`);

    return NextResponse.json(data.data);
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
