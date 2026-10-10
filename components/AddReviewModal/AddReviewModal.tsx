"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { AddReviewForm } from "../AddReviewForm/AddReviewForm";
import { addFeedback } from "@/lib/feedbacks";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./AddReviewModal.module.css";

interface AddReviewModalProps {
  locationId: string;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  locationId,
}) => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const handleFormSubmit = async (values: {
    rate: number;
    description: string;
  }) => {
    const rawUser = user as unknown as Record<string, unknown> | null;
    const currentUserName =
      user?.name || (rawUser?.userName as string) || user?.email;

    if (!currentUserName) {
      toast.error(
        "Не вдалося визначити ім'я користувача. Будь ласка, авторизуйтесь.",
      );
      return;
    }

    try {
      await addFeedback({
        locationId,
        userName: currentUserName,
        rate: values.rate,
        description: values.description,
      });

      toast.success("Відгук успішно додано!");

      router.refresh();

      handleClose();
    } catch (error: unknown) {
      console.error("Помилка при створенні відгуку:", error);
      toast.error("Не вдалося зберегти відгук. Перевірте авторизацію.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.reviewPopup} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.popupCloseBtn}
          onClick={handleClose}
          aria-label="Закрити модальне вікно"
        >
          <IoClose size={24} />
        </button>
        <h2 className={styles.popupTitle}>Залишити відгук</h2>
        <AddReviewForm onSubmit={handleFormSubmit} onCancel={handleClose} />
      </div>
    </div>
  );
};
