import { Suspense } from "react";
import HeroBlock from "@/components/Home/HeroBlock/HeroBlock";
import AdvantagesBlock from "@/components/Home/AdvantagesBlock/AdvantagesBlock";
import PopularSection from "@/components/Home/PopularLocationsBlock/PopularSection";
import FeedbacksSection from "@/components/Home/ReviewsBlock/FeedbacksSection";
import Loader from "@/components/Loader/Loader";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <HeroBlock />
      <AdvantagesBlock />

      <Suspense fallback={<Loader />}>
        <PopularSection />
        <FeedbacksSection />
      </Suspense>
    </main>
  );
}
