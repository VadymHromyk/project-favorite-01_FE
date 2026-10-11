"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import LocationsGrid from "@/components/Locations/LocationsGrid/LocationsGrid";
import ProfilePlaceholder from "@/components/ProfilePlaceholder/ProfilePlaceholder";
import { getUserLocations } from "@/lib/profileApi";

interface ProfileClientProps {
  userId: string;
  isOwnProfile: boolean;
}

const ProfileClient = ({ userId, isOwnProfile }: ProfileClientProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["profileLocations", userId],

    queryFn: ({ pageParam }) =>
      getUserLocations({
        userId,
        page: pageParam,
        limit: 6,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,

    retry: false,
    refetchOnWindowFocus: false,
  });

  const locations = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  if (!isPending && !error && locations.length === 0) {
    return <ProfilePlaceholder isOwnProfile={isOwnProfile} />;
  }

  return (
    <LocationsGrid
      locations={locations}
      isOwnProfile={isOwnProfile}
      hasNextPage={hasNextPage}
      isLoading={isPending}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => {
        if (hasNextPage && !isFetchingNextPage && !error) {
          void fetchNextPage();
        }
      }}
      error={error}
    />
  );
};

export default ProfileClient;