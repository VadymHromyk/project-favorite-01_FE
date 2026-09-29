import Link from "next/link";
import css from "./Logo.module.css";

interface LogoProps {
  onClick?: () => void;
}

export default function Logo({ onClick }: LogoProps) {
  return (
    <div className={css.logoWrapper}>
      <Link href="/" className={css.logo} onClick={onClick}>
        <svg className={css.logoIconWrapper} aria-hidden="true">
          <use className={css.logoIcon} href="/sprite.svg#map_search"></use>
        </svg>
        <span className={css.logoText}>Relax Map</span>
      </Link>
    </div>
  );
}
