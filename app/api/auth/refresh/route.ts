import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parseSetCookie } from "cookie";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    return NextResponse.json({ success: true });
  }

  if (!refreshToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const apiRes = await api.post(
      "/auth/refresh",
      {},
      { headers: { Cookie: cookieStore.toString() } },
    );

    const setCookie = apiRes.headers["set-cookie"];

    if (!setCookie) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const res = NextResponse.json({ success: true }, { status: 200 });
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

    for (const cookieStr of cookieArray) {
      const parsed = parseSetCookie(cookieStr);
      if (parsed?.name && parsed.value) {
        res.cookies.set(parsed.name, parsed.value, {
          path: parsed.path ?? "/",
          expires: parsed.expires,
          maxAge: parsed.maxAge,
          httpOnly: parsed.httpOnly,
        });
      }
    }

    return res;
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
