// modalStore.ts
import React from 'react';
import { create } from 'zustand';

type ModalPayload = any;

type RenderArgs = {
  close: () => void;
  payload: ModalPayload;
};

type RenderFn = (args: RenderArgs) => React.ReactNode;

type ModalState = {
  open: boolean;
  payload: ModalPayload;
  render: RenderFn | null;
  openModal: (render: RenderFn, payload?: ModalPayload) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  payload: undefined,
  render: null,
  openModal: (render, payload) => set({ open: true, render, payload }),
  closeModal: () => set({ open: false, render: null, payload: undefined }),
}));
