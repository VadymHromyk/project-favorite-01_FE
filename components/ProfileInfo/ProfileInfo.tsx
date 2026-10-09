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
      <div className={css.Header}>
        {avatarSrc ? (
          <Image
            className={css.Avatar}
            src={avatarSrc}
            alt={`Аватар користувача ${username}`}
            width={145}
            height={145}
            priority
            unoptimized
          />
        ) : (
          <span className={css.AvatarFallback} aria-hidden="true">
            {username.charAt(0).toUpperCase()}
          </span>
        )}

        <div className={css.Info}>
          <h1 className={css.Name}>{username}</h1>
          <p className={css.Articles}>Статей: {locationsCount}</p>
        </div>

        {isOwnProfile && (
          <AppButton
            variant="secondary"
            onClick={handleOpenModal}
            className={css.EditButton}
          >
            Редагувати профіль
          </AppButton>
        )}
      </div>

      {isModalOpen && (
        <div className={css.ModalBackdrop} onClick={handleCloseModal}>
          <div
            className={css.ModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={css.CloseBtn}
              onClick={handleCloseModal}
              disabled={isLoading}
              aria-label="Закрити"
            >
              ✕
            </button>

            <h2 className={css.ModalTitle}>Редагувати профіль</h2>

            <form onSubmit={handleSubmit} className={css.ModalForm}>
              <div className={css.AvatarFieldGroup}>
                <label className={css.Label}>Аватар</label>
                <div className={css.AvatarUploadRow}>
                  <Image
                    src={previewSrc || LOCAL_DEFAULT_AVATAR}
                    alt="Прев'ю аватара"
                    width={80}
                    height={80}
                    className={css.AvatarPreview}
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
                    className={css.UploadBtn}
                  >
                    Завантажити фото
                  </AppButton>
                </div>
              </div>

              <div className={css.InputGroup}>
                <label htmlFor="name" className={css.Label}>
                  Ім&apos;я
                </label>
                <input
                  id="name"
                  type="text"
                  className={css.Input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введіть нове ім'я"
                  required
                />
              </div>

              <div className={css.ModalActions}>
                <AppButton
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className={css.CancelBtn}
                >
                  Відмінити
                </AppButton>
                <AppButton
                  type="submit"
                  disabled={isLoading}
                  className={css.SaveBtn}
                >
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
