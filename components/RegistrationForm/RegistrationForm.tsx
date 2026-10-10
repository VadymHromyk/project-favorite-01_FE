"use client";

import { ApiError } from "@/app/api/api";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import css from "./RegistrationForm.module.css";

export interface RegistrationFormValues {
  name: string;
  email: string;
  password: string;
}

const INITIAL_VALUES: RegistrationFormValues = {
  name: "",
  email: "",
  password: "",
};

const VALIDATION_SCHEMA = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Імʼя має містити щонайменше 2 символи")
    .max(32, "Імʼя має містити не більше 32 символів")
    .required("Введіть імʼя"),
  email: Yup.string()
    .trim()
    .email("Введіть коректну адресу пошти, наприклад hello@relaxmap.ua")
    .max(64, "Пошта має містити не більше 64 символів")
    .required("Введіть пошту"),
  password: Yup.string()
    .min(8, "Пароль має містити щонайменше 8 символів")
    .max(128, "Пароль має містити не більше 128 символів")
    .required("Введіть пароль"),
});

const FIELDS = [
  {
    name: "name",
    label: "Імʼя*",
    type: "text",
    placeholder: "Ваше імʼя",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Пошта*",
    type: "email",
    placeholder: "hello@relaxmap.ua",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Пароль*",
    type: "password",
    placeholder: "********",
    autoComplete: "new-password",
  },
] as const;

const DEFAULT_ERROR_MESSAGE = "Не вдалося зареєструватися. Спробуйте ще раз";

export default function RegistrationForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: RegistrationFormValues) => {
    try {
      const user = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      if (user) {
        setUser(user);
        router.replace(`/profile/${encodeURIComponent(user._id)}`);
      } else {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Oops... some error",
      );

      toast.error(errorMessage ?? DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={css.form} noValidate>
          {FIELDS.map(({ name, label, type, placeholder, autoComplete }) => {
            const hasError = Boolean(errors[name] && touched[name]);

            return (
              <div key={name} className={css.field}>
                <label htmlFor={name} className={css.label}>
                  {label}
                </label>
                <Field
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className={
                    hasError ? `${css.input} ${css.inputError}` : css.input
                  }
                />
                <ErrorMessage name={name} component="p" className={css.error} />
              </div>
            );
          })}

          <button type="submit" className={css.button} disabled={isSubmitting}>
            {isSubmitting ? "Реєстрація..." : "Зареєструватись"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
