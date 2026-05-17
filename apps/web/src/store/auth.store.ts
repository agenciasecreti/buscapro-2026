'use client';

import type { AuthResult, PublicUser } from '@buscapro/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authService } from '@/services/auth.service';

interface AuthState {
  token: string | null;
  user: PublicUser | null;
  /** Indica que o estado persistido já foi reidratado do localStorage. */
  hydrated: boolean;
  isAuthenticated: () => boolean;
  setSession: (result: AuthResult) => void;
  setUser: (user: PublicUser) => void;
  setHydrated: () => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,

      isAuthenticated: () => Boolean(get().token && get().user),

      setSession: (result) => set({ token: result.token, user: result.user }),

      setUser: (user) => set({ user }),

      setHydrated: () => set({ hydrated: true }),

      logout: () => set({ token: null, user: null }),

      refresh: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const user = await authService.me(token);
          set({ user });
        } catch {
          // Token inválido/expirado — encerra a sessão silenciosamente.
          set({ token: null, user: null });
        }
      },
    }),
    {
      name: 'buscapro.auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
