import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProfileClient from "./ProfilePage.client";
import ProfileHeaderWrapper from "@/components/ProfileInfo/ProfileWrapper";
import css from "./ProfilePage.module.css";
import type { CurrentUserResponse, UserProfileResponse } from "@/types/profile";

const API_URL = (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL)
  ?.replace(/\/+$/, "")
  .replace(/\/api$/, "");

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { userId } = await params;

  if (!API_URL) {
    throw new Error(
      "BACKEND_API_URL or NEXT_PUBLIC_API_URL must be configured",
    );
  }

  const profileResponse = await fetch(
    `${API_URL}/api/users/${encodeURIComponent(userId)}`,
    { cache: "no-store" },
  );

  if (profileResponse.status === 404) {
    notFound();
  }

  if (!profileResponse.ok) {
    throw new Error("Не вдалося отримати інформацію про користувача");
  }

  const profileData: UserProfileResponse = await profileResponse.json();
  const profileUser = profileData.data;

  let isOwnProfile = false;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (cookieHeader) {
    try {
      const currentUserResponse: Response = await fetch(
        `${API_URL}/api/users/me`,
        {
          headers: {
            Cookie: cookieHeader,
          },
          cache: "no-store",
        },
      );

      if (currentUserResponse.ok) {
        const currentUserData: CurrentUserResponse =
          await currentUserResponse.json();
        const currentUser = currentUserData.data;

        // Нормалізація та вилучення ID
        const currentUserObj = currentUser as unknown as Record<
          string,
          unknown
        >;
        const rawCurrentId = String(
          currentUserObj.id || currentUserObj._id || "",
        ).trim();

        const profileUserObj = profileUser as unknown as Record<
          string,
          unknown
        >;
        const rawPageUserId = String(
          profileUserObj.id || profileUserObj._id || userId,
        ).trim();
        const rawParamUserId = String(userId).trim();

        // Логування в термінал сервера для налагодження
        console.log("=== PROFILE OWNER CHECK ===");
        console.log("Current User ID (/api/users/me):", rawCurrentId);
        console.log("Page User ID (profileUser):", rawPageUserId);
        console.log("Param User ID (URL params):", rawParamUserId);

        isOwnProfile = Boolean(
          rawCurrentId &&
          (rawCurrentId.toLowerCase() === rawPageUserId.toLowerCase() ||
            rawCurrentId.toLowerCase() === rawParamUserId.toLowerCase()),
        );

        console.log("Is Own Profile Result:", isOwnProfile);
      } else {
        console.warn(
          "Request to /api/users/me failed with status:",
          currentUserResponse.status,
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(
          "Помилка під час перевірки поточного користувача:",
          err.message,
        );
      } else {
        console.error("Невідома помилка під час перевірки користувача");
      }
    }
  } else {
    console.warn("No cookies found in server request context");
  }

  const initialUserData = {
    name: profileUser.name,
    avatarUrl: profileUser.avatarUrl,
    articlesAmount: profileUser.articlesAmount,
  };

  return (
    <main>
      <section className={css.pageHeader}>
        <div className="container">
          <ProfileHeaderWrapper
            initialUser={initialUserData}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </section>

      <section className={css.locationsSection}>
        <div className="container">
          <div className={css.locationsContent}>
            {!isOwnProfile && <h2 className={css.locationsTitle}>Локації</h2>}

            <ProfileClient userId={userId} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
