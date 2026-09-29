import css from "./AuthFooter.module.css";

export default function AuthFooter() {
  return (
    <div className={css.authFooter}>
      <p className={css.authText}>
        &copy; {new Date().getFullYear()} Relax Map
      </p>
    </div>
  );
}
