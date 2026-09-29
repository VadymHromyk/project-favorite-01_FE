"use client";

import { usePathname } from "next/navigation";
import AuthFooter from "./AuthFooter/AuthFooter";
import MainFooter from "./MainFooter/MainFooter";

export const Footer = () => {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isAuthRoute) {
    return <AuthFooter />;
  }

  return <MainFooter />;
};
