import axios from "axios";

export interface LocationOwner {
  _id: string;
  name: string;
}

export interface Location {
  _id: string;
  name: string;
  locationType: string;
  // older records may still have the field under this name
  type?: string;
  region: string;
  description: string;
  image: string;
  rate?: number;
  coordinates?: { lat?: number; lon?: number };
  ownerId: string | LocationOwner;
  feedbacksId: string[];
}

const api = axios.create({ baseURL: "/api" });

export const createLocation = async (formData: FormData) => {
  const { data } = await api.post<Location>("/locations", formData);
  return data;
};

export const getLocationById = async (id: string) => {
  const { data } = await api.get<Location>(
    `/locations/${encodeURIComponent(id)}`,
  );
  return data;
};

export const updateLocation = async (id: string, formData: FormData) => {
  const { data } = await api.patch<Location>(
    `/locations/${encodeURIComponent(id)}`,
    formData,
  );
  return data;
};
