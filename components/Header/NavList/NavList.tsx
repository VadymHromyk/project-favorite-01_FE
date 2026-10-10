"use client";

import css from "./NavList.module.css";
import Link from "next/link";

interface NavListProps {
  isAuth: boolean;
  userId?: string;
  onNavigate?: () => void;
}

export default function NavList({ isAuth, userId, onNavigate }: NavListProps) {
  return (
    <ul className={css.navList}>
      {isAuth && userId ? (
        <li className={css.navItem}>
          <Link
            href={`/profile/${encodeURIComponent(userId)}`}
            onClick={onNavigate}
            aria-label="Перейти до мого профілю"
          >
            Мій Профіль
          </Link>
        </li>
      ) : (
        <>
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
        </>
      )}
    </ul>
  );
}
