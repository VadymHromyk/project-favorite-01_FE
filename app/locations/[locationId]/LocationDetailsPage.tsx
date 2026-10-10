"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { LocationDetails, LocationOwner } from "@/types/location";

import LocationInfoBlock from "@/components/LocationInfoBlock/LocationInfoBlock";
import LocationGallery from "@/components/LocationGallery/LocationGallery";
import LocationDescription from "@/components/LocationDescription/LocationDescription";
import ReviewsSection from "@/components/ReviewsSection/ReviewsSection";

import css from "./LocationDetailsPage.module.css";

interface ApiLocationDetails extends LocationDetails {
  type?: string;
  owner?: LocationOwner | null;
}

export interface Feedback {
  _id: string;
  rate: number;
  description: string;
  owner?: {
    _id: string;
    name: string;
    avatar?: string;
  } | null;
  userName?: string;
}

interface FeedbacksResponse {
  data: Feedback[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LocationDetailsPageProps {
  location: ApiLocationDetails;
  regionName: string;
  locationTypeName: string;
}

export default function LocationDetailsPage({
  location,
  regionName,
  locationTypeName,
}: LocationDetailsPageProps) {
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const normalizedLocation: LocationDetails = {
    ...location,
    locationType: location.locationType || location.type || "Не вказано",
    ownerId: location.ownerId ?? location.owner ?? null,
  };

  useEffect(() => {
    const getReviews = async () => {
      try {
        setIsLoading(true);
        setReviewsError(null);

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const { data } = await axios.get<FeedbacksResponse>(
          `${API_URL}/feedbacks`,
          {
            params: {
              locationId: location._id,
            },
          },
        );

        setReviews([...(data.data ?? [])]);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setReviewsError("Не вдалося завантажити відгуки.");
      } finally {
        setIsLoading(false);
      }
    };

    void getReviews();
  }, [location._id]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rate, 0) / reviews.length
      : 0;

  return (
    <main className={css.page}>
      <div className={css.container}>
        <div className={css.hero}>
          <div className={css.info}>
            <LocationInfoBlock
              location={normalizedLocation}
              rating={averageRating}
              regionName={regionName}
              locationTypeName={locationTypeName}
            />
          </div>

          <div className={css.gallery}>
            <LocationGallery
              image={normalizedLocation.image ?? "/images/placeholder.jpg"}
              name={normalizedLocation.name}
            />
          </div>
        </div>

        <LocationDescription
          description={normalizedLocation.description ?? ""}
        />

        <ReviewsSection
          locationId={normalizedLocation._id}
          reviews={reviews}
          isLoading={isLoading}
          error={reviewsError}
        />
      </div>
    </main>
  );
}
