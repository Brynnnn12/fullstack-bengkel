import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string; // Only store name for security
  role?: string; // Add role for role-based access
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userName: string, role?: string) => void; // Add role parameter
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userName: string, role?: string) => {
        set({ user: { name: userName, role: role || 'MANAGER' }, isAuthenticated: true });
        // Token is now stored in httpOnly cookie by backend
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Token will be cleared by backend when cookie expires
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
