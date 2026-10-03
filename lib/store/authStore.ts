import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
}));