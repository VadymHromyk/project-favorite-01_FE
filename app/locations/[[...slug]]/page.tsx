import { getLocations } from '@/lib/locationsApi';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import LocationsClient from './Locations.client';
import css from './LocationPage.module.css';
// import FilterPanel from '@/components/Locations/FilterPanel/FilterPanel';
// import LocationGrid from '@/components/Locations/LocationsGrid/LocationsGrid';

type LocationsPage = Awaited<ReturnType<typeof getLocations>>;

interface LocationPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{
    region?: string;
    locationType?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function LocationPage({
  params,
  searchParams,
}: LocationPageProps) {
  const { slug = [] } = await params;
  const filters = await searchParams;
  const region = filters.region ?? (slug[0] === 'all' ? undefined : slug[0]);
  const locationType =
    filters.locationType ?? (slug[1] === 'all' ? undefined : slug[1]);
  const sort = filters.sort ?? (slug[3] === 'all' ? undefined : slug[3]);
  const search = filters.search;
  //   const regionKey = slug[0] ?? 'all';
  //   const region = regionKey === 'all' ? undefined : regionKey;
  //   const locationTypeKey = slug[1] ?? 'all';
  //   const locationType = locationTypeKey === 'all' ? undefined : locationTypeKey;
  //   const sortKey = slug[3] ?? 'all';
  //   const sort = sortKey === 'all' ? undefined : sortKey;

  const queryClient = new QueryClient();

  await queryClient
    .infiniteQuery({
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
      getNextPageParam: (lastPage: LocationsPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    })
    .catch(() => undefined);
  // Previous regular query prefetch:
  // await queryClient.query({
  //   queryKey: ['location', search, region, locationType, sort, 1],
  //   queryFn: () => getLocations({ page: 1, search, region, locationType, sort }),
  // });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className={css.container}>
          <h1 className={css.title}>Усі місця відпочинку</h1>
          <LocationsClient
            key={`${search ?? ''}|${region ?? ''}|${locationType ?? ''}|${sort ?? ''}`}
            region={region}
            locationType={locationType}
            sort={sort}
            search={search}
          ></LocationsClient>
          {/* <FilterPanel region={region} locationType={locationType} sort={sort} />
        <LocationGrid locations={data.locations} /> */}
        </div>
      </HydrationBoundary>
    </>
  );
}
