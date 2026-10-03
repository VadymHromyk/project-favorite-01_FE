import type { Metadata } from "next";
import AuthNav from "@/components/AuthNav/AuthNav";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Реєстрація | Relax Map",
  description: "Створіть акаунт, щоб ділитися місцями відпочинку в Україні",
};

export default function RegisterPage() {
  return (
    <main className={css.main}>
      <div className={css.content}>
        <AuthNav />
        <h1 className={css.title}>Реєстрація</h1>
        <RegistrationForm />
      </div>
    </main>
  );
}