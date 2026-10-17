"use client";

import { checkSessionClient, getMeClient } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { ReactNode, useEffect, useRef } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearAuth);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const fetchUser = async () => {
      // try {
      //   const isAuthenticated = await checkSessionClient();
      //   if (!isAuthenticated) {
      //     clearIsAuthenticated();
      //     return;
      //   }
      //   const user = await getMeClient();
      //   if (user) setUser(user);
      // } catch {
      //   clearIsAuthenticated();
      // }
      try {
        const user = await getMeClient();
        if (user) setUser(user);
        else clearIsAuthenticated();
      } catch (error: any) {
        // розлогінюємо лише при 401, а не при мережевій помилці
        if (error?.response?.status === 401) clearIsAuthenticated();
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
};

export default AuthProvider;
