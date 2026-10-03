"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./AuthNav.module.css";

const AUTH_LINKS = [
  { href: "/register", label: "Реєстрація" },
  { href: "/login", label: "Вхід" },
];

export default function AuthNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Навігація авторизації">
      <ul className={css.list}>
        {AUTH_LINKS.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className={css.item}>
              <Link
                href={href}
                className={isActive ? `${css.link} ${css.active}` : css.link}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}