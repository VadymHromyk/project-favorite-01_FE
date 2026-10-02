"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LocationForm from "@/components/LocationForm/LocationForm";
import { createLocation } from "@/lib/api/locations";
import { getLocationErrorMessage } from "@/lib/api/errors";
import type { LocationFormOptions } from "@/lib/api/serverCategories";

export default function CreateLocationForm({
  typeOptions,
  regionOptions,
}: LocationFormOptions) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const { _id } = await createLocation(formData);
      router.push(`/locations/${_id}`);
      return true;
    } catch (error) {
      toast.error(getLocationErrorMessage(error, "create"));
      return false;
    }
  };

  return (
    <LocationForm
      mode="create"
      typeOptions={typeOptions}
      regionOptions={regionOptions}
      onSubmit={handleSubmit}
    />
  );
}
