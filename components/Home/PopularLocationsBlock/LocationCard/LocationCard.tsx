import Image from "next/image";
import css from "./LocationCard.module.css";
import { Stars } from "@/components/Ui/Stars";
import { AppLink } from "@/components/Ui/Button/Button";
import { Icon } from "@/components/Ui/Icon/Icon";
import { Location } from "@/types/location";

interface LocationCardProps {
  location: Location;
  isOwnProfile?: boolean;
}

export default function LocationCard({
  location,
  isOwnProfile = false,
}: LocationCardProps) {
  const rate = location.rate ?? 0;
  const imageUrl = location.image || "/placeholder-location.webp";

  return (
    <div className={css.cardWrapper}>
      <div className={css.cardImageWrapper}>
        <Image
          width={280}
          height={280}
          src={imageUrl}
          alt={location.name ?? "Локація"}
          className={css.cardImage}
        />
      </div>
      <div className={css.cardContent}>
        <p className={css.locationType}>{location.locationType}</p>
        <div className={css.starsWrapper}>
          <Stars rate={rate} />
        </div>
        <h3 className={css.cardTitle}>{location.name}</h3>
        <div className={css.cardActions}>
          <AppLink
            href={`/locations/${location._id}`}
            className={css.cardLink}
            variant="secondary"
            ariaLabel={`Переглянути локацію ${location.name ?? ""}`}
          >
            Переглянути локацію
          </AppLink>

          {isOwnProfile && (
            <AppLink
              href={`/locations/${location._id}/edit`}
              className={css.editLink}
              variant="secondary"
              ariaLabel={`Редагувати локацію ${location.name}`}
            >
              <Icon name="edit" className={css.editIcon} />
            </AppLink>
          )}
        </div>
      </div>
    </div>
  );
}
