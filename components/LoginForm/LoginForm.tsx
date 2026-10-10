"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./LoginForm.module.css";
import { useRouter } from "next/navigation";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Введіть коректну email-адресу")
    .required("Поле обовʼязкове для заповнення"),
  password: Yup.string()
    .min(6, "Пароль має містити щонайменше 6 символів")
    .required("Поле обовʼязкове для заповнення"),
});

interface FormValues {
  email: string;
  password: string;
}

interface UserPayload {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface LoginResponseData {
  data?: {
    user?: UserPayload;
    id?: string;
    _id?: string;
  };
  user?: UserPayload;
  id?: string;
  _id?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ): Promise<void> => {
    try {
      const response = await api.post<LoginResponseData>("/auth/login", values);

      toast.success("Авторизація успішна!");

      const responseData = response.data;
      const userObj =
        responseData?.data?.user || responseData?.user || responseData?.data;

      if (userObj && typeof setUser === "function") {
        setUser(userObj as unknown as Parameters<typeof setUser>[0]);
      }

      const userId =
        userObj?.id || userObj?._id || responseData?.id || responseData?._id;

      if (userId && userId !== "undefined") {
        window.location.href = `/profile/${userId}`;
      } else {
        try {
          const meRes = await api.get("/users/me");
          const myId =
            meRes.data?.data?.id || meRes.data?.data?._id || meRes.data?.id;

          if (myId) {
            window.location.href = `/profile/${myId}`;
            return;
          }
        } catch (meError: unknown) {
          console.error("Не вдалося отримати профайл користувача:", meError);
        }

        window.location.href = "/";
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Помилка авторизації. Перевірте введені дані.";
        toast.error(errorMessage);
      } else {
        toast.error("Щось пішло не так. Спробуйте пізніше.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
      validateOnBlur={true}
      validateOnChange={false}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={styles.form} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Пошта*
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="hello@relaxmap.ua"
              className={`${styles.input} ${
                touched.email && errors.email ? styles.inputError : ""
              }`}
            />
            {touched.email && errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Пароль*
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="********"
              className={`${styles.input} ${
                touched.password && errors.password ? styles.inputError : ""
              }`}
            />
            {touched.password && errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitBtn}
          >
            {isSubmitting ? "Завантаження..." : "Увійти"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
