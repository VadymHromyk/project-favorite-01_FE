"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import css from "./Profile.module.css";
import formatUserName from "@/utils/getShortUsernameHeader";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/store";
import { ConfirmationModal } from "@/src/components/ConfirmationModal/ConfirmationModal";

interface ProfileProps {
  onNavigate?: () => void;
}

const LOCAL_DEFAULT_AVATAR = "/default-avatar.png";

export default function Profile({ onNavigate }: ProfileProps) {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const avatarUrl = user?.avatarUrl?.trim() || null;
  const avatarSrc =
    avatarUrl && avatarUrl !== failedSrc ? avatarUrl : LOCAL_DEFAULT_AVATAR;

  const openLogoutModal = (): void => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = (): void => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Помилка під час виходу з сервера:", error);
    } finally {
      clearAuth();

      setIsLogoutModalOpen(false);
      onNavigate?.();

      window.location.href = "/";
    }
  };

  return (
    <div className={css.profileWrapper}>
      <div className={css.editButton}>
        <Image
          key={avatarSrc}
          className={css.profileImage}
          src={avatarSrc}
          alt="Profile image"
          width={32}
          height={32}
          unoptimized
          loading="eager"
          onError={() => {
            if (avatarUrl) setFailedSrc(avatarUrl);
          }}
        />
        <span className={css.profileName}>{formatUserName(user?.name)}</span>
      </div>

      <span className={css.profileBorder}></span>

      <button
        className={css.profileLogoutButton}
        onClick={openLogoutModal}
        type="button"
        aria-label="Вийти з профілю"
      >
        {React.createElement(
          "svg",
          { className: css.profileLogoutIcon, "aria-hidden": "true" },
          React.createElement("use", { href: "/sprite.svg#logout" }),
        )}
      </button>

      {isLogoutModalOpen &&
        createPortal(
          <ConfirmationModal
            title="Ви точно хочете вийти?"
            description="Ми будемо сумувати за вами!"
            confirmButtonText="Вийти"
            cancelButtonText="Відмінити"
            onConfirm={handleLogout}
            onCancel={closeLogoutModal}
          />,
          document.body,
        )}
    </div>
  );
}