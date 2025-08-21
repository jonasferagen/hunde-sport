// navProgressStore.ts
import { create } from 'zustand';

type NavigationProgress = {
    active: boolean;
    start: () => void;
    stop: () => void;
};

export const useNavigationProgress = create<NavigationProgress>((set, get) => ({
    active: false,
    start: () => {
        if (!get().active) set({ active: true });
    },
    stop: () => {
        if (get().active) set({ active: false });
    },
}));
