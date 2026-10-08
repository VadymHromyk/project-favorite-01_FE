"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileInfo from "./ProfileInfo";

interface ProfileWrapperProps {
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
  initialUser,
  isOwnProfile: initialIsOwnProfile,
}: ProfileWrapperProps) {
  const [user, setUser] = useState(initialUser);
  const [isOwn, setIsOwn] = useState<boolean>(initialIsOwnProfile);
  const router = useRouter();

  useEffect(() => {
    if (initialIsOwnProfile) return;

    let isMounted = true;

    const checkClientOwner = async () => {
      try {
        const endpoint = API_URL ? `${API_URL}/api/users/me` : "/api/users/me";
        const res = await fetch(endpoint, { credentials: "include" });

        if (res.ok) {
          const meData = await res.json();
          const meUser = meData.data || meData;

          const meId = String(meUser?.id || meUser?._id || "").trim();

          if (isMounted && (meId || meUser?.name === initialUser.name)) {
            setIsOwn(true);
          }
        }
      } catch (err) {
        console.error("Client side owner check error:", err);
      }
    };

    checkClientOwner();

    return () => {
      isMounted = false;
    };
  }, [initialIsOwnProfile, initialUser.name]);

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
        setUser({
          name: updatedUser.name ?? user.name,
          avatarUrl: updatedUser.avatarUrl ?? user.avatarUrl,
          articlesAmount: updatedUser.articlesAmount ?? user.articlesAmount,
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Помилка під час оновлення профілю:", error);
      alert("Не вдалося зберегти зміни. Спробуйте ще раз.");
    }
  };

  return (
    <ProfileInfo
      username={user.name}
      avatar={user.avatarUrl}
      locationsCount={user.articlesAmount}
      isOwnProfile={isOwn}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}
