import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { isAxiosError } from "axios";
import { api } from "../../api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("/auth/register", body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

            for (const cookieStr of cookieArray) {
        const parsed = parseSetCookie(cookieStr);

        cookieStore.set(parsed.name, parsed.value ?? "", {
          expires: parsed.expires,
          path: parsed.path,
          maxAge: parsed.maxAge,
          httpOnly: parsed.httpOnly,
          secure: parsed.secure,
          sameSite: parsed.sameSite,
        });
      }
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          message:
            error.response?.data?.message ??
            "Не вдалося зареєструватися. Спробуйте ще раз",
        },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "Помилка сервера. Спробуйте пізніше" },
      { status: 500 },
    );
  }
}