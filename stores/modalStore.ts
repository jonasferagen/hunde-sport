// modalStore.ts
import React from 'react';
import { create } from 'zustand';

export type WizardRenderArgs<P> = {
  close: () => void;
  payload: P;
  updatePayload: (next: P) => void;
  setPosition: (index: number) => void;
};

export type WizardRenderFn<P> = (args: WizardRenderArgs<P>) => React.ReactNode;

type State = {
  open: boolean;
  render: WizardRenderFn<unknown> | null;
  payload: unknown;
  version: number;
  openModal: <P>(render: WizardRenderFn<P>, payload: P) => void;
  updatePayload: <P>(next: P) => void;
  closeModal: () => void;
};

export const useModalStore = create<State>((set) => ({
  open: false,
  render: null,
  payload: undefined,
  version: 0,

  openModal: (render, payload) =>
    set((s) => ({
      open: true,
      render: render as WizardRenderFn<unknown>,
      payload,
      version: s.version + 1, // Clean remount on modal opening
    })),

  updatePayload: (next) =>
    set((s) => ({
      payload: next,
    })),

  closeModal: () =>
    set({
      open: false,
      render: null,
      payload: undefined,
      version: 0,
    }),
}));
