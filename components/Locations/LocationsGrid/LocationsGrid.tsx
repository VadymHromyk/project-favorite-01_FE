'use client';

import css from './LocationGrid.module.css';
import LocationCard from '@/components/Home/PopularLocationsBlock/LocationCard/LocationCard';
import { Location } from '@/types/profile';
import { AppButton } from '@/components/Ui/Button/Button';
import { useEffect, useRef } from 'react';
// import Pagination from '@/components/Locations/Pagination/Pagination';

interface LocationGridProps {
  locations: Location[];
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  error?: Error | null;
}

export default function LocationGrid({
  locations,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  onLoadMore,
  error,
}: LocationGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nextBatchStartIndex = useRef<number | null>(null);

  useEffect(() => {
    const startIndex = nextBatchStartIndex.current;
    if (startIndex !== null && locations.length > startIndex) {
      containerRef.current?.children[startIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      nextBatchStartIndex.current = null;
    }
  }, [locations.length]);

  if (isLoading) {
    return <p role="status">Завантаження локацій...</p>;
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
        {locations.map(location => (
          <div className={css.cardItem} key={location._id}>
            <LocationCard location={location} />
          </div>
        ))}
      </div>
      {isFetchingNextPage && <p role="status">Завантаження...</p>}
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
          {isFetchingNextPage ? 'Завантаження...' : 'Показати ще'}
        </AppButton>
      )}

      {/* <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      /> */}
    </section>
  );
}
