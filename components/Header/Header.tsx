"use client";

import { usePathname } from "next/navigation";
import css from "./Header.module.css";
import { useState } from "react";
import { useAuthStore } from "@/store";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
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
                <NavList isAuth={isAuth} />
              </div>
              <div className={css.authNavWrapper}>
                <AuthNav isAuth={isAuth} onNavigate={closeMenu} />
              </div>
              {isAuth && (
                <div className={css.profileWrapper}>
                  <Profile user={user} />
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
