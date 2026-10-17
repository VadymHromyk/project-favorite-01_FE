import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "@/lib/api/serverApi";
import { parseSetCookie } from "cookie";

const privateRoutes = ["/auth/logout", "/auth/refresh", "/users/me"];
const publicRoutes = ["/auth/login", "/auth/register"];

// "/auth/logout",
//     "/auth/refresh",
//     "/auth/login",
//     "/auth/register",
//     "/profile/:path*",
//     "/users/:path*",
//     "/locations/:path*",
//     "/feedbacks",

type NewCookie = {
  name: string;
  value: string;
  options: {
    path: string;
    expires?: Date;
    maxAge?: number;
    httpOnly?: boolean;
  };
};

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Шлях, на який користувач намагається перейти
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!accessToken) {
    if (refreshToken) {
      // Якщо accessToken відсутній, але є refreshToken — потрібно перевірити сесію навіть для публічного маршруту,
      // адже сесія може залишатися активною, і тоді потрібно заборонити доступ до публічного маршруту.

      let data;
      try {
        data = await checkServerSession();
      } catch {
        // бекенд недоступний (таймаут): не розлогінюємо, пропускаємо запит
        return NextResponse.next();
      }

      const setCookie = data?.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (parsed.value) {
            cookieStore.set(parsed.name, parsed.value, parsed);
          }
        }

        // Якщо сесія все ще активна:
        // для публічного маршруту — виконуємо редірект на головну.
        if (isPublicRoute) {
          return NextResponse.redirect(new URL("/", request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
        // для приватного маршруту — дозволяємо доступ

        return NextResponse.next({
          headers: {
            Cookie: cookieStore.toString(),
          },
        });
      }
    }

    // Якщо refreshToken або сесії немає:
    // публічний маршрут — дозволяємо доступ
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // приватний маршрут — редірект на сторінку входу
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Якщо accessToken існує:
  // публічний маршрут — виконуємо редірект на головну
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // приватний маршрут — дозволяємо доступ
  if (isPrivateRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/logout",
    "/auth/refresh",
    "/auth/login",
    "/auth/register",
    "/profile/:path*",
    "/users/:path*",
    "/locations/:path*",
    "/feedbacks",
  ],
};
