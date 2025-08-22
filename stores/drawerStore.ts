// stores/drawerStore.ts
import { create } from 'zustand';
import { DrawerActions } from '@react-navigation/native';
import { type DrawerContentComponentProps } from '@react-navigation/drawer';

type DrawerState = {
    isFullyClosed: boolean;
    hasOpened: boolean;
    // controls installed at runtime
    openDrawer?: () => void;
    closeDrawer?: () => void;

    // setters
    setFullyClosed: (v: boolean) => void;
    markHasOpened: () => void;

    // installer (called inside drawer with navigation)
    installControls: (nav: DrawerContentComponentProps['navigation']) => void;
    clearControls: () => void;
};

export const useDrawerStore = create<DrawerState>((set) => ({
    isFullyClosed: true,
    hasOpened: false,
    openDrawer: undefined,
    closeDrawer: undefined,

    setFullyClosed: (v) => set({ isFullyClosed: v }),
    markHasOpened: () => set({ hasOpened: true }),

    installControls: (nav) =>
        set({
            openDrawer: () => nav.dispatch(DrawerActions.openDrawer()),
            closeDrawer: () => nav.dispatch(DrawerActions.closeDrawer()),
        }),

    clearControls: () => set({ openDrawer: undefined, closeDrawer: undefined }),
}));

// Optional convenience calls
export const openDrawer = () => useDrawerStore.getState().openDrawer?.();
export const closeDrawer = () => useDrawerStore.getState().closeDrawer?.();
