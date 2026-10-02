"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { ErrorMessage, Field, Form, Formik, type FormikProps } from "formik";
import type { SelectOption } from "@/lib/constants/locationOptions";
import {
  ALLOWED_IMAGE_TYPES,
  getLocationValidationSchema,
  type LocationFormMode,
} from "./validation";
import css from "./LocationForm.module.css";

export interface LocationFormValues {
  name: string;
  locationType: string;
  region: string;
  description: string;
}

interface FormValues extends LocationFormValues {
  image: File | null;
}

interface LocationFormProps {
  mode: LocationFormMode;
  initialValues?: LocationFormValues;
  initialImageUrl?: string;
  typeOptions: SelectOption[];
  regionOptions: SelectOption[];
  // resolves to true when the data is saved and navigation has started
  onSubmit: (formData: FormData) => Promise<boolean>;
}

const EMPTY_VALUES: LocationFormValues = {
  name: "",
  locationType: "",
  region: "",
  description: "",
};

const BUTTON_TEXT = {
  create: { submit: "Опублікувати", submitting: "Публікація...", cancel: "Відмінити" },
  edit: { submit: "Зберегти зміни", submitting: "Збереження...", cancel: "Відмінити зміни" },
};

export default function LocationForm({
  mode,
  initialValues = EMPTY_VALUES,
  initialImageUrl,
  typeOptions,
  regionOptions,
  onSubmit,
}: LocationFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Formik starts a new submit on every click, even before the button re-renders as disabled
  const isSendingRef = useRef(false);
  // "saved" keeps the form locked after a successful save until navigation ends
  const [status, setStatus] = useState<"idle" | "sending" | "saved">("idle");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const formInitialValues: FormValues = { ...initialValues, image: null };
  const displayedImage = previewUrl ?? (mode === "edit" ? initialImageUrl : undefined);
  const text = BUTTON_TEXT[mode];

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    { setFieldValue, setFieldTouched }: FormikProps<FormValues>,
  ) => {
    const file = event.currentTarget.files?.[0];
    // dialog cancelled: keep the previously selected file
    if (!file) return;

    const canPreview = ALLOWED_IMAGE_TYPES.includes(file.type) && file.size > 0;
    setPreviewUrl(canPreview ? URL.createObjectURL(file) : null);
    setFieldTouched("image", true, false);
    setFieldValue("image", file);
  };

  const handleReset = ({ resetForm }: FormikProps<FormValues>) => {
    resetForm();
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (values: FormValues) => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setStatus("sending");

    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("locationType", values.locationType);
    formData.append("region", values.region);
    formData.append("description", values.description.trim());
    if (values.image) formData.append("image", values.image);

    let isSaved = false;
    try {
      isSaved = await onSubmit(formData);
    } finally {
      setStatus(isSaved ? "saved" : "idle");
      if (!isSaved) isSendingRef.current = false;
    }
  };

  return (
    <Formik<FormValues>
      initialValues={formInitialValues}
      validationSchema={getLocationValidationSchema(mode)}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const { errors, touched, values, isSubmitting, isValid, dirty } = formik;
        const isBusy = isSubmitting || status !== "idle";
        // create: errors are revealed on submit, so only an untouched form is blocked
        const isSubmitDisabled =
          isBusy || !dirty || (mode === "edit" && !isValid);
        const hasError = (field: keyof FormValues) => Boolean(touched[field] && errors[field]);
        const fieldClass = (field: keyof FormValues, base: string) =>
          hasError(field) ? `${base} ${css.fieldError}` : base;

        return (
          <Form className={css.form} noValidate>
            <div className={css.group}>
              <label className={css.label} htmlFor="image">
                Обкладинка статті
              </label>
              <div className={fieldClass("image", css.preview)}>
                {displayedImage ? (
                  <Image
                    src={displayedImage}
                    alt="Обкладинка статті"
                    fill
                    unoptimized
                    loading="eager"
                    className={css.previewImage}
                  />
                ) : (
                  <svg
                    className={css.previewIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14Zm-5.04-6.71-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71Z" />
                  </svg>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png"
                className={css.fileInput}
                onChange={(event) => handleFileChange(event, formik)}
              />
              <button
                type="button"
                className={css.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
              >
                Завантажити фото
              </button>
              <ErrorMessage name="image" component="p" className={css.errorText} />
            </div>

            <div className={css.group}>
              <label className={css.label} htmlFor="name">
                Назва місця
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Введіть назву місця"
                className={fieldClass("name", css.input)}
              />
              <ErrorMessage name="name" component="p" className={css.errorText} />
            </div>

            <div className={css.group}>
              <label className={css.label} htmlFor="locationType">
                Тип місця
              </label>
              <Field
                as="select"
                id="locationType"
                name="locationType"
                className={fieldClass(
                  "locationType",
                  values.locationType
                    ? css.select
                    : `${css.select} ${css.selectEmpty}`,
                )}
              >
                <option value="" disabled>
                  Оберіть тип місця
                </option>
                {typeOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="locationType" component="p" className={css.errorText} />
            </div>

            <div className={css.group}>
              <label className={css.label} htmlFor="region">
                Регіон
              </label>
              <Field
                as="select"
                id="region"
                name="region"
                className={fieldClass(
                  "region",
                  values.region ? css.select : `${css.select} ${css.selectEmpty}`,
                )}
              >
                <option value="" disabled>
                  Оберіть регіон
                </option>
                {regionOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="region" component="p" className={css.errorText} />
            </div>

            <div className={css.group}>
              <label className={css.label} htmlFor="description">
                Детальний опис
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Детальний опис локації"
                className={fieldClass("description", css.textarea)}
              />
              <ErrorMessage name="description" component="p" className={css.errorText} />
            </div>

            <div className={css.actions}>
              <button
                type="submit"
                className={css.primaryButton}
                disabled={isSubmitDisabled}
              >
                {isBusy && <span className={css.spinner} aria-hidden="true" />}
                {isBusy ? text.submitting : text.submit}
              </button>
              <button
                type="button"
                className={css.secondaryButton}
                onClick={() => handleReset(formik)}
                disabled={isBusy}
              >
                {text.cancel}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
