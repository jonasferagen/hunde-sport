// modalStore.ts
import React from 'react';
import { create } from 'zustand';

type RenderArgs = {
  close: () => void;
  replace: (render: RenderFn, payload?: unknown) => void;
  payload: unknown;
};
type RenderFn = (args: RenderArgs) => React.ReactNode;

type ModalState = {
  open: boolean;
  payload: unknown;
  render: RenderFn | null;
  version: number;
  openModal: (render: RenderFn, payload?: unknown) => void;
  replaceModal: (render: RenderFn, payload?: unknown) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  payload: undefined,
  render: null,
  version: 0,
  openModal: (render, payload) => set((s) => ({ open: true, render, payload, version: s.version + 1 })),
  replaceModal: (render, payload) => set((s) => ({ open: true, render, payload, version: s.version + 1 })),
  closeModal: () => set({ open: false, render: null, payload: undefined }),
}));
