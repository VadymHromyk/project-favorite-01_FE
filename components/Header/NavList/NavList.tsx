"use client";

import css from "./NavList.module.css";
import Link from "next/link";

interface NavListProps {
  isAuth: boolean;
  onNavigate?: () => void;
}

export default function NavList({ isAuth, onNavigate }: NavListProps) {
  return (
    <ul className={css.navList}>
      <li className={css.navItem}>
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="Перейти на головну сторінку"
        >
          Головна
        </Link>
      </li>
      <li className={css.navItem}>
        <Link
          href="/locations"
          onClick={onNavigate}
          aria-label="Перейти до місць відпочинку"
        >
          Місця відпочинку
        </Link>
      </li>
      {isAuth && (
        <li className={css.navItem}>
          <Link
            href="/profile"
            onClick={onNavigate}
            aria-label="Перейти до мого профілю"
          >
            Мій Профіль
          </Link>
        </li>
      )}
    </ul>
  );
}
