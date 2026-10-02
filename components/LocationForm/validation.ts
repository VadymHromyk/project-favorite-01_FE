import * as Yup from "yup";

export type LocationFormMode = "create" | "edit";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
export const MAX_IMAGE_SIZE = 1024 * 1024;

export const getLocationValidationSchema = (mode: LocationFormMode) =>
  Yup.object({
    image: Yup.mixed<File>()
      .nullable()
      .test(
        "required",
        "Завантажте фото локації",
        (file) => mode === "edit" || Boolean(file),
      )
      .test(
        "fileType",
        "Фото має бути у форматі jpg або png",
        (file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type),
      )
      .test("fileNotEmpty", "Файл порожній", (file) => !file || file.size > 0)
      .test(
        "fileSize",
        "Розмір фото має бути менше 1 МБ",
        (file) => !file || file.size < MAX_IMAGE_SIZE,
      ),
    name: Yup.string()
      .trim()
      .min(3, "Назва має містити щонайменше 3 символи")
      .max(96, "Назва має містити не більше 96 символів")
      .required("Введіть назву місця"),
    locationType: Yup.string()
      .trim()
      .max(64, "Тип має містити не більше 64 символів")
      .required("Оберіть тип місця"),
    region: Yup.string()
      .trim()
      .max(64, "Регіон має містити не більше 64 символів")
      .required("Оберіть регіон"),
    description: Yup.string()
      .trim()
      .min(20, "Опис має містити щонайменше 20 символів")
      .max(6000, "Опис має містити не більше 6000 символів")
      .required("Додайте опис локації"),
  });
