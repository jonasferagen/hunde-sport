
// categoryUiStore.ts
import { create } from 'zustand';

type UI = { expanded: Record<number, boolean>; toggle: (id: number) => void };
export const useCategoryTreeStore = create<UI>((set) => ({
    expanded: {},
    toggle: (id) => set((s) => ({ expanded: { ...s.expanded, [id]: !s.expanded[id] } })),
}));

export const useIsExpanded = (id: number) =>
    useCategoryTreeStore((s) => !!s.expanded[id]);       // subscribes only to expanded[id]

export const useToggleExpanded = () =>
    useCategoryTreeStore((s) => s.toggle);
