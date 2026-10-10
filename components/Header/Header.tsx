"use client";

import { usePathname } from "next/navigation";
import css from "./Header.module.css";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import Profile from "./Profile/Profile";
import NavList from "./NavList/NavList";
import AuthNav from "./AuthNav/AuthNav";
import Logo from "./Logo/Logo";
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import Menu from "./Menu/Menu";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useCloseOnMediaQuery } from "@/hooks/useCloseOnMediaQuery";

export default function Header() {
  const pathname = usePathname();

  const isAuth = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);

  const checkAuth = useAuthStore((state) =>
    "checkAuth" in state && typeof state.checkAuth === "function"
      ? state.checkAuth
      : "getMe" in state && typeof state.getMe === "function"
        ? state.getMe
        : undefined,
  );

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (checkAuth) {
      void checkAuth();
    }
  }, [checkAuth]);

  const handleMenuClick = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  useLockBodyScroll(isMenuOpen);
  useCloseOnMediaQuery("(min-width: 1440px)", closeMenu);

  return (
    <div className={css.headerWrapper}>
      <div className={css.container}>
        <Logo onClick={closeMenu} />
        <div className={css.navWrapper}>
          {pathname !== "/login" && pathname !== "/register" && (
            <>
              <div className={css.navListWrapper}>
                <NavList isAuth={isAuth} userId={user?._id} />
              </div>
              <div className={css.authNavWrapper}>
                <AuthNav isAuth={isAuth} onNavigate={closeMenu} />
              </div>
              {isAuth && (
                <div className={css.profileWrapper}>
                  <Profile />
                </div>
              )}
              <BurgerMenu
                isMenuOpen={isMenuOpen}
                handleMenuClick={handleMenuClick}
              />
              {isMenuOpen && (
                <Menu user={user} isAuth={isAuth} onNavigate={closeMenu} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
