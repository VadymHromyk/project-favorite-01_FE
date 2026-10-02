import type { Metadata } from "next";
import EditLocationForm from "@/components/EditLocationForm/EditLocationForm";
import { getLocationByIdServer } from "@/lib/api/serverLocations";
import { getLocationFormOptions } from "@/lib/api/serverCategories";
import css from "@/app/locations/LocationFormPage.module.css";

interface EditLocationPageProps {
  params: Promise<{ locationId: string }>;
}

export async function generateMetadata({
  params,
}: EditLocationPageProps): Promise<Metadata> {
  const { locationId } = await params;
  const location = await getLocationByIdServer(locationId);

  return {
    title: `Редагування: ${location.name}`,
    description: `Редагування інформації про місце "${location.name}"`,
  };
}

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const { locationId } = await params;
  const [location, options] = await Promise.all([
    getLocationByIdServer(locationId),
    getLocationFormOptions(),
  ]);

  const initialValues = {
    name: location.name,
    locationType: location.locationType ?? location.type ?? "",
    region: location.region,
    description: location.description,
  };

  return (
    <main className={css.page}>
      <div className={css.container}>
        <h1 className={css.title}>Редагування місця</h1>
        <EditLocationForm
          locationId={location._id}
          initialValues={initialValues}
          initialImageUrl={location.image}
          {...options}
        />
      </div>
    </main>
  );
}
