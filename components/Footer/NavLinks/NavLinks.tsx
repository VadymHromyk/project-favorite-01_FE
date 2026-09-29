"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import css from "./NavLinks.module.css";

export default function NavLinks() {
  const pathname = usePathname();

  const handleScrollToTop =
    (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== href) {
        return;
      }

      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

  return (
    <nav className={css.navColumn} aria-label="Footer navigation">
      <ul className={css.linkList}>
        <li>
          <Link
            href="/"
            className={css.navLink}
            onClick={handleScrollToTop("/")}
          >
            Головна
          </Link>
        </li>
        <li>
          <Link
            href="/locations"
            className={css.navLink}
            onClick={handleScrollToTop("/locations")}
          >
            Місця відпочинку
          </Link>
        </li>
      </ul>
    </nav>
  );
}
