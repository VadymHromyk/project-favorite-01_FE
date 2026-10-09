"use client";

import css from "./LocationGrid.module.css";
import LocationCard from "@/components/Home/PopularLocationsBlock/LocationCard/LocationCard";
import { Location } from "@/types/profile";
import { AppButton } from "@/components/Ui/Button/Button";
import { useEffect, useRef } from "react";
import Loader from "@/components/Loader/Loader";

interface LocationGridProps {
  locations: Location[];
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  error?: Error | null;
  isOwnProfile?: boolean;
}

export default function LocationGrid({
  locations,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  onLoadMore,
  error,
  isOwnProfile = false,
}: LocationGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nextBatchStartIndex = useRef<number | null>(null);

  useEffect(() => {
    const startIndex = nextBatchStartIndex.current;
    if (startIndex !== null && locations.length > startIndex) {
      containerRef.current?.children[startIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      nextBatchStartIndex.current = null;
    }
  }, [locations.length]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p role="alert">Не вдалося завантажити локації.</p>;
  }

  if (locations.length === 0) {
    return <p>За вашим запитом локацій не знайдено.</p>;
  }

  return (
    <section className={css.container}>
      <div className={css.cards} ref={containerRef}>
        {locations.map((location) => (
          <div className={css.cardItem} key={location._id}>
            <LocationCard location={location} isOwnProfile={isOwnProfile} />
          </div>
        ))}
      </div>
      {isFetchingNextPage && <Loader />}
      {hasNextPage && (
        <AppButton
          className={css.searchButton}
          type="button"
          aria-label="Показати ще"
          disabled={isFetchingNextPage}
          onClick={() => {
            nextBatchStartIndex.current = locations.length;
            onLoadMore();
          }}
        >
          {isFetchingNextPage ? "Завантаження..." : "Показати ще"}
        </AppButton>
      )}
    </section>
  );
}
