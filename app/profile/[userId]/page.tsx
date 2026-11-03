import ProfileHeaderWrapper from "@/components/ProfileInfo/ProfileWrapper";
import { getMeServer, getUserByIdServer } from "@/lib/api/serverApi";
import { User } from "@/types/user";
import ProfileClient from "./ProfilePage.client";
import css from "./ProfilePage.module.css";

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { userId } = await params;

  const guestUser: User = await getUserByIdServer(userId);
  const authorizedUser: User | null = await getMeServer();

  let isOwnProfile = false;

  const rawAuthorizedId = authorizedUser?.id?.trim();
  const rawGuestUserId = guestUser.id?.trim();
  const rawParamUserId = String(userId).trim();

  console.log("=== PROFILE OWNER CHECK ===");
  console.log("Current User ID (/api/users/me):", rawAuthorizedId);
  console.log("Page User ID (profileUser):", rawGuestUserId);
  console.log("Param User ID (URL params):", rawParamUserId);

  isOwnProfile = Boolean(
    rawAuthorizedId &&
    (rawAuthorizedId.toLowerCase() === rawGuestUserId?.toLowerCase() ||
      rawAuthorizedId.toLowerCase() === rawParamUserId.toLowerCase()),
  );

  console.log("Is Own Profile Result:", isOwnProfile);

  const initialUserData = {
    name: guestUser?.name,
    avatarUrl: guestUser?.avatarUrl,
    articlesAmount: guestUser?.articlesAmount,
  };

  return (
    <main>
      <section className={css.pageHeader}>
        <div className="container">
          <ProfileHeaderWrapper
            userId={userId}
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
