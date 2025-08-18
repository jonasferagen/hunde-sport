// navProgressStore.ts
import { create } from 'zustand';

type NavProgress = {
    active: boolean;
    start: () => void;
    stop: () => void;
};

export const useNavProgress = create<NavProgress>((set, get) => ({
    active: false,
    start: () => {
        if (!get().active) set({ active: true });
    },
    stop: () => {
        if (get().active) set({ active: false });
    },
}));
