"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LocationForm, {
  type LocationFormValues,
} from "@/components/LocationForm/LocationForm";
import { updateLocation } from "@/lib/api/locations";
import { getLocationErrorMessage } from "@/lib/api/errors";
import type { LocationFormOptions } from "@/lib/api/serverCategories";

interface EditLocationFormProps extends LocationFormOptions {
  locationId: string;
  initialValues: LocationFormValues;
  initialImageUrl: string;
}

export default function EditLocationForm({
  locationId,
  initialValues,
  initialImageUrl,
  typeOptions,
  regionOptions,
}: EditLocationFormProps) {
  const router = useRouter();

  // TODO: перевірити після мерджа PATCH /api/locations/:id на бекенді
  const handleSubmit = async (formData: FormData) => {
    try {
      await updateLocation(locationId, formData);
      router.push(`/locations/${locationId}`);
      return true;
    } catch (error) {
      toast.error(getLocationErrorMessage(error, "edit"));
      return false;
    }
  };

  return (
    <LocationForm
      mode="edit"
      initialValues={initialValues}
      initialImageUrl={initialImageUrl}
      typeOptions={typeOptions}
      regionOptions={regionOptions}
      onSubmit={handleSubmit}
    />
  );
}
