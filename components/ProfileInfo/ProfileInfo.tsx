"use client";

import Image from "next/image";
import { useState, useRef, ChangeEvent } from "react";
import { AppButton } from "@/components/Ui/Button/Button";
import css from "./ProfileInfo.module.css";

interface ProfileInfoProps {
  username: string;
  avatar?: string;
  locationsCount?: number;
  isOwnProfile?: boolean;
  onUpdateProfile?: (data: FormData) => Promise<void> | void;
}

const LOCAL_DEFAULT_AVATAR = "/default-avatar.png";

export default function ProfileInfo({
  username,
  avatar,
  locationsCount = 0,
  isOwnProfile = true,
  onUpdateProfile,
}: ProfileInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(username);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidAvatar =
    Boolean(avatar) &&
    typeof avatar === "string" &&
    (avatar.trim().startsWith("http") || avatar.trim().startsWith("/"));

  const avatarSrc = isValidAvatar ? (avatar as string) : LOCAL_DEFAULT_AVATAR;

  const handleOpenModal = () => {
    setName(username);
    setSelectedFile(null);
    setPreviewSrc(avatarSrc);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsModalOpen(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      if (onUpdateProfile) {
        await onUpdateProfile(formData);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Помилка оновлення профілю:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={css.profile}>
        {avatarSrc ? (
          <Image
            className={css.avatar}
            src={avatarSrc}
            alt={`Аватар користувача ${username}`}
            width={145}
            height={145}
            priority
            unoptimized
          />
        ) : (
          <span className={css.avatarPlaceholder} aria-hidden="true">
            {username.charAt(0).toUpperCase()}
          </span>
        )}

        <div className={css.avatarContent}>
          <h1 className={css.username}>{username}</h1>
          <p className={css.articlesCount}>Статей: {locationsCount}</p>
        </div>

        {isOwnProfile && (
          <AppButton
            variant="secondary"
            onClick={handleOpenModal}
            className={css.editBtn}
          >
            Редагувати профіль
          </AppButton>
        )}
      </div>

      {isModalOpen && (
        <div className={css.modalBackdrop} onClick={handleCloseModal}>
          <div
            className={css.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={css.modalHeader}>
              <h2>Редагувати профіль</h2>
              <button
                type="button"
                className={css.closeBtn}
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={css.modalForm}>
              <div className={css.avatarPreviewContainer}>
                <Image
                  src={previewSrc || LOCAL_DEFAULT_AVATAR}
                  alt="Прев'ю аватара"
                  width={100}
                  height={100}
                  className={css.avatarPreview}
                  unoptimized
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <AppButton
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  Обрати фото з ПК
                </AppButton>
              </div>

              <div className={css.inputGroup}>
                <label htmlFor="name">Ім&apos;я користувача</label>
                <input
                  id="name"
                  type="text"
                  className={css.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введіть ваше ім'я"
                  required
                />
              </div>

              <div className={css.modalActions}>
                <AppButton
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Скасувати
                </AppButton>
                <AppButton type="submit" disabled={isLoading}>
                  {isLoading ? "Збереження..." : "Зберегти"}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
