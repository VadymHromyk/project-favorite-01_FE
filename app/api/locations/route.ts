import { NextResponse, type NextRequest } from "next/server";
import { getAuthCookieHeader, proxyToBackend } from "@/lib/api/backendProxy";

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  return proxyToBackend("/api/locations", {
    method: "POST",
    body: formData,
    headers: { Cookie: await getAuthCookieHeader() },
  });
}
