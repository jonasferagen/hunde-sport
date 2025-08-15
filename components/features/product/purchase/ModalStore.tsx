import { ReactNode } from 'react';
import { create } from 'zustand';

type ModalRenderer<TPayload = any> = (
    payload: TPayload,
    api: { close: () => void; setPosition: (pos: number) => void }
) => ReactNode

type ModalOptions = {
    snapPoints?: number[] // e.g. [90] or [0.9, 0.5] if using decimals elsewhere
    initialPosition?: number // index into snapPoints
    onClose?: () => void
}

type ModalState = {
    // state
    open: boolean
    payload?: any
    renderer?: ModalRenderer<any>
    snapPoints: number[]
    position: number
    onClose?: () => void

    // actions
    openModal: <T = any>(
        renderer: ModalRenderer<T>,
        payload?: T,
        opts?: ModalOptions
    ) => void
    closeModal: () => void
    setPosition: (pos: number) => void
}

export const useModalStore = create<ModalState>((set, get) => ({
    open: false,
    payload: undefined,
    renderer: undefined,
    snapPoints: [90],
    position: 0,
    onClose: undefined,

    openModal: (renderer, payload, opts) =>
        set({
            open: true,
            renderer,
            payload,
            snapPoints: opts?.snapPoints ?? [90],
            position: opts?.initialPosition ?? 0,
            onClose: opts?.onClose,
        }),

    closeModal: () => {
        const cb = get().onClose
        // clear first so children unmount cleanly
        set({
            open: false,
            renderer: undefined,
            payload: undefined,
            onClose: undefined,
        })
        cb?.()
    },

    setPosition: (pos) => set({ position: pos }),
}))

// Convenience functions to use outside React components:
export const openModal = useModalStore.getState().openModal
export const closeModal = useModalStore.getState().closeModal
export const setModalPosition = useModalStore.getState().setPosition
