"use client";
0;

import React from "react";
import Image from "next/image";
import css from "./Profile.module.css";
import type { User } from "@/types/auth";
import formatUserName from "@/utils/getShortUsernameHeader";
import { useRouter } from "next/navigation";

interface ProfileProps {
  user: User | null;
  onNavigate?: () => void;
}

export default function Profile({ user, onNavigate }: ProfileProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/confirmation");
    onNavigate?.();
  };

  const avatarUrl = user?.avatarUrl || "/default-avatar.png";

  return (
    <div className={css.profileWrapper}>
      <div className={css.editButton}>
        <Image
          className={css.profileImage}
          src={avatarUrl}
          alt="Profile image"
          width={32}
          height={32}
          unoptimized
          loading="eager"
        />
        <span className={css.profileName}>{formatUserName(user?.name)}</span>
      </div>

      <span className={css.profileBorder}></span>

      <button
        className={css.profileLogoutButton}
        onClick={handleLogout}
        type="button"
        aria-label="Wijti  profilu"
      >
        {React.createElement(
          "svg",
          { className: css.profileLogoutIcon, "aria-hidden": "true" },
          React.createElement("use", { href: "/sprite.svg#logout" }),
        )}
      </button>
    </div>
  );
}
