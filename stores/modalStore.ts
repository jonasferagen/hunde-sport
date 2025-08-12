// modalStore.ts
import React from 'react';
import { create } from 'zustand';

export type RenderFn<P> = (args: RenderArgs<P>) => React.ReactNode;
export type RenderArgs<P> = {
  close: () => void;
  // generic replace so you can swap to a different payload type if needed
  replace: <N>(render: RenderFn<N>, payload?: N) => void;
  payload: P;
};

type ModalState = {
  open: boolean;
  payload: unknown;
  render: RenderFn<unknown> | null;
  version: number;
  openModal: <P>(render: RenderFn<P>, payload?: P) => void;
  replaceModal: <P>(render: RenderFn<P>, payload?: P) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  payload: undefined,
  render: null,
  version: 0,
  openModal: (render, payload) =>
    set((s) => ({
      open: true,
      render: render as RenderFn<unknown>,
      payload,
      version: s.version + 1,
    })),
  replaceModal: (render, payload) =>
    set((s) => ({
      open: true,
      render: render as RenderFn<unknown>,
      payload,
      version: s.version + 1,
    })),
  closeModal: () => set({ open: false, render: null, payload: undefined }),
}));
