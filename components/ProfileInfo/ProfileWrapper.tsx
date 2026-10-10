"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import ProfileInfo from "./ProfileInfo";

interface ProfileWrapperProps {
  userId: string;
  initialUser: {
    name: string;
    avatarUrl?: string;
    articlesAmount?: number;
  };
  isOwnProfile: boolean;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "")
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

export default function ProfileWrapper({
  userId,
  initialUser,
  isOwnProfile: serverIsOwnProfile,
}: ProfileWrapperProps) {
  const [profileUser, setProfileUser] = useState(initialUser);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const authUserId = String(authUser?.id ?? authUser?._id ?? "").trim();
  const isOwn =
    serverIsOwnProfile ||
    (authUserId !== "" &&
      authUserId.toLowerCase() === String(userId).trim().toLowerCase());

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const endpoint = API_URL ? `${API_URL}/api/users/me` : "/api/users/me";

      const res = await fetch(endpoint, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Помилка при оновленні профілю");
      }

      const responseData = await res.json();
      const updatedUser = responseData.data || responseData;

      if (updatedUser) {
        setProfileUser({
          name: updatedUser.name ?? profileUser.name,
          avatarUrl: updatedUser.avatarUrl ?? profileUser.avatarUrl,
          articlesAmount:
            updatedUser.articlesAmount ?? profileUser.articlesAmount,
        });
      }

      try {
        const meRes = await fetch(endpoint, {
          credentials: "include",
          cache: "no-store",
        });

        if (meRes.ok) {
          const meData = await meRes.json();
          const meUser = meData.data || meData;
          const currentUser = useAuthStore.getState().user;

          setAuthUser({ ...currentUser, ...meUser });
        }
      } catch (err) {
        console.error("Не вдалося оновити користувача в store:", err);
      }

      router.refresh();
    } catch (error) {
      console.error("Помилка під час оновлення профілю:", error);
      alert("Не вдалося зберегти зміни. Спробуйте ще раз.");
    }
  };

  return (
    <ProfileInfo
      username={profileUser.name}
      avatar={profileUser.avatarUrl}
      locationsCount={profileUser.articlesAmount}
      isOwnProfile={isOwn}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}