import Link from "next/link";
import type { Location } from "@/types/location";

import css from "./LocationInfoBlock.module.css";

interface LocationInfoBlockProps {
  location: Location;
  rating: number;
  regionName: string;
  locationTypeName: string;
}

export default function LocationInfoBlock({
  location,
  rating,
  regionName,
  locationTypeName,
}: LocationInfoBlockProps) {
  const owner =
    typeof location.ownerId === "object" && location.ownerId !== null
      ? location.ownerId
      : null;

  const roundedRating = Math.round(rating);

  return (
    <div className={css.wrapper}>
      <div
        className={css.rating}
        aria-label={`Рейтинг локації ${rating.toFixed(1)} з 5`}
      >
        <span className={css.stars}>
          {"★".repeat(roundedRating)}
          {"☆".repeat(5 - roundedRating)}
        </span>

        <span className={css.ratingValue}>{rating.toFixed(1)}</span>
      </div>

      <h1 className={css.title}>{location.name}</h1>

      <div className={css.details}>
        <p className={css.detail}>
          <span className={css.label}>Регіон:</span> {regionName}
        </p>

        <p className={css.detail}>
          <span className={css.label}>Тип локації:</span> {locationTypeName}
        </p>

        <p className={css.detail}>
          <span className={css.label}>Автор статті:</span>{" "}
          {owner ? (
            <Link href={`/profile/${owner._id}`} className={css.author}>
              {owner.name}
            </Link>
          ) : (
            <span>Невідомий автор</span>
          )}
        </p>
      </div>
    </div>
  );
}
