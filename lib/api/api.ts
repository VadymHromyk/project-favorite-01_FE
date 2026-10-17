import axios from "axios";

export const nextServer = axios.create({
  baseURL: "/api",
});

export const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
