'use client';

import FilterPanel from '@/components/Locations/FilterPanel/FilterPanel';
import LocationGrid from '@/components/Locations/LocationsGrid/LocationsGrid';
import { getLocations } from '@/lib/locationsApi';
import { useInfiniteQuery } from '@tanstack/react-query';
import css from './Locations.client.module.css';

interface LocationsClientProps {
  region: string | undefined;
  locationType: string | undefined;
  sort: string | undefined;
  search: string | undefined;
}

export default function LocationsClient({
  region,
  locationType,
  sort,
  search,
}: LocationsClientProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['locations', search, region, locationType, sort],
    queryFn: ({ pageParam }) =>
      getLocations({
        page: pageParam,
        search,
        region,
        locationType,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    placeholderData: prev => prev,
  });
  const locations = data?.pages.flatMap(page => page.locations) ?? [];

  return (
    <div className={css.content}>
      <FilterPanel region={region} locationType={locationType} sort={sort} />
      <LocationGrid
        locations={locations}
        hasNextPage={hasNextPage}
        isLoading={isPending}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => {
          void fetchNextPage();
        }}
        error={error}
      />
    </div>
  );
}
