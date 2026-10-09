import imageCompression from "browser-image-compression";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./validation";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.9,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg",
};

const toJpegName = (name: string) => `${name.replace(/\.[^.]+$/, "")}.jpg`;

// large jpg/png photos are converted to a smaller JPEG, everything else is returned as is
export const compressImageIfNeeded = async (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size < MAX_IMAGE_SIZE) {
    return file;
  }

  const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
  return new File([compressed], toJpegName(file.name), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};
