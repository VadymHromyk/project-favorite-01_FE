"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileInfo from "./ProfileInfo";
import { getMeClient, updateMeClient } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface ProfileWrapperProps {
  userId: string;
  initialUser?: {
    name?: string;
    avatarUrl?: string;
    articlesAmount?: number;
  };
  isOwnProfile: boolean;
}

export default function ProfileWrapper({
  userId,
  initialUser,
  isOwnProfile: serverIsOwnProfile,
}: ProfileWrapperProps) {
  const [profileUser, setProfileUser] = useState(initialUser);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const authUserId = String(authUser?.id ?? "").trim();
  const isOwn =
    serverIsOwnProfile ||
    (authUserId !== "" &&
      authUserId.toLowerCase() === String(userId).trim().toLowerCase());

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const updatedUser = await updateMeClient(formData);

      if (!updatedUser) {
        throw new Error("Помилка при оновленні профілю");
      }

      if (updatedUser) {
        setProfileUser({
          name: updatedUser.name ?? profileUser?.name ?? "",
          avatarUrl: updatedUser.avatarUrl ?? profileUser?.avatarUrl ?? "",
        });
      }

      try {
        const meUser = await getMeClient();
        if (meUser) {
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
      username={profileUser?.name}
      avatar={profileUser?.avatarUrl}
      locationsCount={profileUser?.articlesAmount}
      isOwnProfile={isOwn}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}
