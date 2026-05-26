import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ensureSeedData } from "../data/seed";
import { createLocalJwt, decodeLocalJwt, toAuthUser, verifyPassword } from "../lib/security";
import { userRepository } from "../repositories/users";
import type { AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      initialized: false,

      async initialize() {
        await ensureSeedData();
        const { token } = get();

        if (!token) {
          set({ initialized: true, user: null });
          return;
        }

        const decoded = await decodeLocalJwt(token);
        set({ initialized: true, user: decoded, token: decoded ? token : null });
      },

      async login(username, password) {
        await ensureSeedData();
        const user = await userRepository.findByUsername(username);

        if (!user || !user.active) {
          throw new Error("Invalid username or password");
        }

        const passwordMatches = await verifyPassword(password, user.passwordSalt, user.passwordHash);

        if (!passwordMatches) {
          throw new Error("Invalid username or password");
        }

        const token = await createLocalJwt(user);
        set({ token, user: toAuthUser(user), initialized: true });
      },

      logout() {
        set({ user: null, token: null });
      }
    }),
    {
      name: "retail-pocket-auth",
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
);
