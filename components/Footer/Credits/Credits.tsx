import css from "./Credits.module.css";

export default function Credits() {
  return (
    <div className={css.credits}>
      <div className={css.divider} />
      <div className={css.creditsRow}>
        <p className={css.copyText}>
          &copy; {new Date().getFullYear()} Природні Мандри. Усі права захищені.
        </p>
      </div>
    </div>
  );
}
