// stores/modalStore.ts
import { ReactNode } from 'react';
import { create } from 'zustand';

type ModalRenderer<TPayload = any> = (
    payload: TPayload,
    api: { close: () => void; setPosition: (pos: number) => void }
) => ReactNode;

type ModalOptions = {
    snapPoints?: number[];
    initialPosition?: number;
    onClose?: () => void;
};

type ModalStatus = 'closed' | 'opening' | 'open' | 'closing';

type ModalState = {
    // state
    open: boolean;
    status: ModalStatus;
    renderer?: ModalRenderer<any>;
    payload?: any;
    snapPoints: number[];
    position: number;
    onClose?: () => void;

    // actions
    openModal: <T = any>(renderer: ModalRenderer<T>, payload?: T, opts?: ModalOptions) => void;
    closeModal: () => void;
    setPosition: (pos: number) => void;
    setStatus: (s: ModalStatus) => void;

    // waiters
    waitUntilClosed: () => Promise<void>;
};

export const useModalStore = create<ModalState>((set, get) => ({
    open: false,
    status: 'closed',
    renderer: undefined,
    payload: undefined,
    snapPoints: [95],
    position: 0,
    onClose: undefined,

    openModal: (renderer, payload, opts) => {
        const snaps = opts?.snapPoints ?? [95];
        const initial = Math.min(Math.max(opts?.initialPosition ?? 0, 0), Math.max(0, snaps.length - 1));
        set({
            open: true,
            status: 'opening',
            renderer,
            payload,
            snapPoints: snaps,
            position: initial,
            onClose: opts?.onClose,
        });
    },

    closeModal: () => {
        set({ status: 'closing', open: false });
        const cb = get().onClose;
        // clear non-structural fields
        set({ renderer: undefined, payload: undefined, onClose: undefined });
        cb?.();
    },

    setPosition: (pos) => set({ position: pos }),
    setStatus: (s) => set({ status: s }),

    // ---- NEW: promise resolves only when status === 'closed' ----
    waitUntilClosed: () =>
        new Promise<void>((resolve) => {
            if (get().status === 'closed') return resolve();
            let unsub: () => void;
            unsub = useModalStore.subscribe((state) => {
                if (state.status === 'closed') {
                    unsub();
                    resolve();
                }
            });
        }),
}));

// tiny helpers (kept minimal)
export const openModal = (...args: Parameters<ModalState['openModal']>) =>
    useModalStore.getState().openModal(...args);
export const closeModal = () => useModalStore.getState().closeModal();
export const setModalPosition = useModalStore.getState().setPosition;
