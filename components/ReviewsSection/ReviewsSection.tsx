"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Feedback } from "@/app/locations/[locationId]/LocationDetailsPage";
import { useAuthStore } from "@/lib/store/authStore";
import { useAuthModalStore } from "@/src/store/useAuthModalStore";
import { AppButton } from "@/components/Ui/Button/Button";
import { Icon } from "@/components/Ui/Icon/Icon";
import css from "./ReviewsSection.module.css";

interface ReviewsSectionProps {
  locationId: string;
  reviews: Feedback[];
  isLoading: boolean;
  error: string | null;
}

export default function ReviewsSection({
  locationId,
  reviews,
  isLoading,
  error,
}: ReviewsSectionProps) {
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isLoggedIn);

  const openAuthModal = useAuthModalStore((state) => state.openModal);

  const handleAddReview = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    router.push(`/locations/${locationId}/review`);
  };

  const handlePrevious = () => {
    if (reviews.length === 0) return;

    setStartIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (reviews.length === 0) return;

    setStartIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const orderedReviews = [
    ...reviews.slice(startIndex),
    ...reviews.slice(0, startIndex),
  ];
  return (
    <section className={css.section}>
      <div className={css.header}>
        <h2 className={css.title}>Відгуки</h2>

        <button
          type="button"
          className={css.addButton}
          onClick={handleAddReview}
        >
          Залишити відгук
        </button>
      </div>

      {isLoading && <p>Завантаження...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && reviews.length === 0 && (
        <p>Для цієї локації ще немає відгуків.</p>
      )}

      {!isLoading && !error && reviews.length > 0 && (
        <>
          <div className={css.list}>
            {orderedReviews.slice(0, 3).map((review) => (
              <article className={css.card} key={review._id}>
                <div
                  className={css.stars}
                  aria-label={`Оцінка ${review.rate} з 5`}
                >
                  {"★".repeat(review.rate)}
                  {"☆".repeat(5 - review.rate)}
                </div>

                <p className={css.reviewText}>{review.description}</p>

                <p className={css.author}>
                  {review.owner?.name ??
                    review.userName ??
                    "Анонімний користувач"}
                </p>
              </article>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className={css.navigation}>
              <AppButton
                className={css.btnPrev}
                variant="secondary"
                ariaLabel="Previous"
                onClick={handlePrevious}
              >
                <Icon className={css.iconPrev} name="arrow_back" />
              </AppButton>

              <AppButton
                className={css.btnNext}
                variant="secondary"
                ariaLabel="Next"
                onClick={handleNext}
              >
                <Icon className={css.iconNext} name="arrow_forward" />
              </AppButton>
            </div>
          )}
        </>
      )}
    </section>
  );
}
