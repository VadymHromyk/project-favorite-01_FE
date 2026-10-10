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
      const isAuthenticated = await checkSessionClient();
      if (isAuthenticated) {
        const user = await getMeClient();
        if (user) setUser(user);
      } else if (!useAuthStore.getState().isLoggedIn) {
        clearIsAuthenticated();
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
};

export default AuthProvider;
