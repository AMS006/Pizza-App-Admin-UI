import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface AuthState {
    user: User | null
    setUser: (user: User) => void
    logout: () => void
}

export const useAuth = create<AuthState>()(
    devtools(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
    )
);
