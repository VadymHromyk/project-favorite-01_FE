import { cache } from "react";
import { notFound } from "next/navigation";
import type { Location } from "@/lib/api/locations";

export const getLocationByIdServer = cache(async (id: string) => {
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/locations/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  if (response.status === 400 || response.status === 404) notFound();
  if (!response.ok) {
    throw new Error(`Failed to load location: ${response.status}`);
  }

  return (await response.json()) as Location;
});
