import { NextResponse, type NextRequest } from "next/server";
import { getAuthCookieHeader, proxyToBackend } from "@/lib/api/backendProxy";

interface RouteContext {
  params: Promise<{ locationId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { locationId } = await params;

  return proxyToBackend(`/api/locations/${encodeURIComponent(locationId)}`);
}

// TODO: перевірити після мерджа PATCH /api/locations/:id на бекенді
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { locationId } = await params;
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  return proxyToBackend(`/api/locations/${encodeURIComponent(locationId)}`, {
    method: "PATCH",
    body: formData,
    headers: { Cookie: await getAuthCookieHeader() },
  });
}
