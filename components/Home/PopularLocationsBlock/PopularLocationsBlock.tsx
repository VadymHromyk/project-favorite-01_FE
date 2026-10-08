"use client";

import { Location } from "@/types/profile";
import css from "./PopularLocationsBlock.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import LocationCard from "./LocationCard/LocationCard";
import { AppButton, AppLink } from "@/components/Ui/Button/Button";
import { Icon } from "@/components/Ui/Icon/Icon";

interface PopularLocationsBlockProps {
  locations: Location[];
}

export default function PopularLocationsBlock({
  locations,
}: PopularLocationsBlockProps) {
  return (
    <section className={css.popularSection}>
      <div className={css.container}>
        <div className={css.popularHeader}>
          <h2 className={css.popularHeaderTitle}>Популярні локації</h2>
          <AppLink
            className={css.popularHeaderLink}
            href="/locations"
            ariaLabel="Подивитися всі локації"
          >
            Всі локації
          </AppLink>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: `.${css.btnPrev}`,
            nextEl: `.${css.btnNext}`,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            375: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1440: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className={css.swiper}
        >
          {locations.length === 0 ? (
            <p className={css.noLocations}>Немає популярних локацій</p>
          ) : (
            locations.map((location) => (
              <SwiperSlide key={location._id} className={css.swiperSlide}>
                <LocationCard location={location} />
              </SwiperSlide>
            ))
          )}
        </Swiper>

        <div className={css.navigation}>
          <AppButton
            className={css.btnPrev}
            variant="secondary"
            ariaLabel="Previous"
          >
            <Icon className={css.iconPrev} name="arrow_back" />
          </AppButton>
          <AppButton
            className={css.btnNext}
            variant="secondary"
            ariaLabel="Next"
          >
            <Icon className={css.iconNext} name="arrow_forward" />
          </AppButton>
        </div>
      </div>
    </section>
  );
}
