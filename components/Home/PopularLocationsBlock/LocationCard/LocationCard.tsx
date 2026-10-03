import Image from 'next/image';
import css from './LocationCard.module.css';
import { Location } from '@/types/profile';
import { Stars } from '@/components/Ui/Stars';
import { AppLink } from '@/components/Ui/Button/Button';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const rate = location.rate ?? location.rating ?? 0;
  const imageUrl = location.image || '/placeholder-location.webp';

  return (
    <div className={css.cardWrapper}>
      <div className={css.cardImageWrapper}>
        <Image
          width={280}
          height={280}
          src={imageUrl}
          alt={location.name ?? 'Локація'}
          className={css.cardImage}
        />
      </div>
      <div className={css.cardContent}>
        <p className={css.locationType}>{location.locationType}</p>
        <div className={css.starsWrapper}>
          <Stars rate={rate} />
        </div>
        <h3 className={css.cardTitle}>{location.name}</h3>
        <AppLink
          href={`/locations/${location._id}`}
          className={css.cardLink}
          variant="secondary"
          ariaLabel={`Переглянути локацію ${location.name ?? ''}`}
        >
          Переглянути локацію
        </AppLink>
      </div>
    </div>
  );
}
