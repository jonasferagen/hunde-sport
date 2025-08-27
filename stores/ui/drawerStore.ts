// stores/drawerStore.ts
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { create } from 'zustand';

export type DrawerStatus = 'closed' | 'opening' | 'open' | 'closing';

type DrawerState = {
    status: DrawerStatus;            // ← new
    hasOpened: boolean;
    openDrawer?: () => void;
    closeDrawer?: () => void;

    setStatus: (s: DrawerStatus) => void;
    markHasOpened: () => void;

    // wiring
    installControls: (nav: DrawerContentComponentProps['navigation']) => void;
    clearControls: () => void;

    // util
    waitUntilClosed: () => Promise<void>;
};

export const useDrawerStore = create<DrawerState>((set, get) => ({
    status: 'closed',
    hasOpened: false,

    setStatus: (status) => set({ status }),
    markHasOpened: () => set({ hasOpened: true }),

    installControls: (nav) =>
        set({
            openDrawer: () => nav.dispatch(DrawerActions.openDrawer()),
            closeDrawer: () => nav.dispatch(DrawerActions.closeDrawer()),
        }),

    clearControls: () => set({ openDrawer: undefined, closeDrawer: undefined }),

    waitUntilClosed: () =>
        new Promise<void>((resolve) => {
            if (get().status === 'closed') return resolve();

            let unsub: () => void;
            // Subscribe to the WHOLE state (v5 signature)
            unsub = useDrawerStore.subscribe((state) => {
                if (state.status === 'closed') {
                    unsub();
                    resolve();
                }
            });
        }),
}));
