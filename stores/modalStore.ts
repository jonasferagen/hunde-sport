// ModalStore.ts
import { ReactNode } from 'react';
import { InteractionManager } from 'react-native';
import { create } from 'zustand';

type OpenMode = 'immediate' | 'afterInteractions' | { timeoutMs: number };
type CloseMode = 'immediate' | 'afterInteractions' | { timeoutMs: number };

// Rich close arg so we can snap down & apply rAF internally
type CloseArg =
    | CloseMode
    | {
        mode?: CloseMode;      // default: 'afterInteractions'
        snapDown?: boolean;    // slide to last snap before closing (default: true)
        rafTwice?: boolean;    // double rAF before closing (default: true)
    };

type ModalRenderer<TPayload = any> = (
    payload: TPayload,
    api: { close: () => void; setPosition: (pos: number) => void }
) => ReactNode;

type ModalOptions = {
    snapPoints?: number[];     // e.g. [0.9, 0.45]
    initialPosition?: number;  // index into snapPoints
    onClose?: () => void;
    mode?: OpenMode;           // symmetry with close
};

type ModalState = {
    // state
    open: boolean;
    payload?: any;
    renderer?: ModalRenderer<any>;
    snapPoints: number[];
    position: number;
    onClose?: () => void;

    // actions
    openModal: <T = any>(
        renderer: ModalRenderer<T>,
        payload?: T,
        opts?: ModalOptions
    ) => void;

    closeModal: (arg?: CloseArg) => void;
    setPosition: (pos: number) => void;
};

function schedule(mode: OpenMode | CloseMode | undefined, fn: () => void) {
    const m = mode ?? 'afterInteractions';
    if (m === 'afterInteractions') {
        InteractionManager.runAfterInteractions(fn);
    } else if (m === 'immediate') {
        fn();
    } else {
        setTimeout(fn, m.timeoutMs);
    }
}

export const useModalStore = create<ModalState>((set, get) => ({
    open: false,
    payload: undefined,
    renderer: undefined,
    snapPoints: [90, 40],      // use normalized decimals here (match your Sheet config)
    position: 0,
    onClose: undefined,

    openModal: (renderer, payload, opts) => {
        const doOpen = () =>
            set({
                open: true,
                renderer,
                payload,
                snapPoints: opts?.snapPoints ?? [90, 40],
                position: opts?.initialPosition ?? 0,
                onClose: opts?.onClose,
            });

        schedule(opts?.mode ?? 'afterInteractions', doOpen);
    },

    closeModal: (arg) => {
        // Normalize rich args
        const defaults = { mode: 'immediate' as CloseMode, snapDown: true, rafTwice: true };
        const opts = typeof arg === 'string' || typeof arg === 'object' && 'timeoutMs' in arg
            ? { ...defaults, mode: arg as CloseMode }
            : { ...defaults, ...(arg as Exclude<typeof arg, CloseMode>) };

        const doClose = () => {
            const cb = get().onClose;
            set({ open: false, renderer: undefined, payload: undefined, onClose: undefined });
            cb?.();
        };

        const run = () => schedule(opts.mode, doClose);

        // Optionally snap to last snap point first, then double-rAF to avoid flicker
        if (opts.snapDown) {
            const snaps = get().snapPoints;
            const lastIdx = Math.max(0, snaps.length - 1);
            if (get().position !== lastIdx) set({ position: lastIdx });
        }

        if (opts.rafTwice) {
            requestAnimationFrame(() => requestAnimationFrame(run));
        } else {
            run();
        }
    },

    setPosition: (pos) => set({ position: pos }),
}));

// -------- Convenience exports (symmetry) --------
export const openModal = (...args: Parameters<ModalState['openModal']>) =>
    useModalStore.getState().openModal(...args);

export const openModalAfterInteractions = <T,>(
    renderer: ModalRenderer<T>,
    payload?: T,
    opts?: Omit<ModalOptions, 'mode'>
) => useModalStore.getState().openModal(renderer, payload, { ...opts, mode: 'afterInteractions' });

export const openModalWithDelay = <T,>(
    ms: number,
    renderer: ModalRenderer<T>,
    payload?: T,
    opts?: Omit<ModalOptions, 'mode'>
) =>
    setTimeout(() => useModalStore.getState().openModal(renderer, payload, { ...opts, mode: 'immediate' }), ms);

// Close helpers
export const closeModal = (arg?: CloseArg) =>
    useModalStore.getState().closeModal(arg);

export const closeModalNow = () =>
    useModalStore.getState().closeModal('immediate');

export const closeModalSnapDown = () =>
    useModalStore.getState().closeModal({ snapDown: true });

export const setModalPosition = useModalStore.getState().setPosition;
