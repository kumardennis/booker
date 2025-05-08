import { User } from "@/app/types";
import { create } from "zustand";

type UserProfileStore = {
    user: User | null;
    userError: any | null;
    setUser: (user: User | null) => void;
    setUserError: (error: unknown) => void;
};

export const useUserProfileStore = create<UserProfileStore>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user }),
    userError: null,
    setUserError: (error: any) => set((state) => ({ userError: error })),
}));
