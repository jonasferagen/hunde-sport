// stores/navPending.ts
import { create } from 'zustand';
type NavPending = { pendingTo: string | null; setPendingTo: (v: string | null) => void };
export const useNavPending = create<NavPending>((set) => ({
    pendingTo: null, setPendingTo: (v) => set({ pendingTo: v }),
}));
