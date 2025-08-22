// stores/drawerStore.ts
import { create } from 'zustand';

type DrawerState = {
    isFullyClosed: boolean;   // for bottom bar
    hasOpened: boolean;       // drawer content can rely on this
    // actions
    setFullyClosed: (v: boolean) => void;
    markHasOpened: () => void;
};

export const useDrawerStore = create<DrawerState>((set) => ({
    isFullyClosed: true,
    hasOpened: false,
    setFullyClosed: (v) => set({ isFullyClosed: v }),
    markHasOpened: () => set({ hasOpened: true }),
}));
