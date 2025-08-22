// hooks/useModalAnimationStatus.ts
import { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useModalStore } from '@/stores/modalStore';
import { useShallow } from 'zustand/react/shallow';

const OPEN_SETTLE_DELAY_MS = 140;  // tune to your Sheet animation
const CLOSE_SETTLE_DELAY_MS = 50; // small buffer

export function useModalState() {


    const { open, status, setStatus } = useModalStore(
        useShallow((s) => ({
            open: s.open,
            status: s.status,
            setStatus: s.setStatus,
        }))
    );

    // timers/raf guards
    const tOpen = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tClose = useRef<ReturnType<typeof setTimeout> | null>(null);
    const raf1 = useRef<number | null>(null);
    const raf2 = useRef<number | null>(null);

    const clearAll = () => {
        if (tOpen.current) clearTimeout(tOpen.current);
        if (tClose.current) clearTimeout(tClose.current);
        if (raf1.current) cancelAnimationFrame(raf1.current);
        if (raf2.current) cancelAnimationFrame(raf2.current);
        tOpen.current = tClose.current = null;
        raf1.current = raf2.current = null;
    };

    const settleOpen = useCallback(() => {
        // give one paint after the delay
        raf1.current = requestAnimationFrame(() => {
            raf2.current = requestAnimationFrame(() => setStatus('open'));
        });
    }, [setStatus]);

    // Attach this to <Sheet.Frame onLayout={onHostLayout}>
    const onHostLayout = useCallback((_e: LayoutChangeEvent) => {
        if (!open || status !== 'opening') return;
        if (tOpen.current) clearTimeout(tOpen.current);
        tOpen.current = setTimeout(settleOpen, OPEN_SETTLE_DELAY_MS);
    }, [open, status, settleOpen]);

    useEffect(() => {
        clearAll();

        if (open) {
            // entering: ensure we're in 'opening'
            if (status === 'closed') setStatus('opening');

            // fallback in case onLayout is early/missed
            tOpen.current = setTimeout(() => {
                if (useModalStore.getState().open && useModalStore.getState().status === 'opening') {
                    settleOpen();
                }
            }, OPEN_SETTLE_DELAY_MS + 60);
        } else {
            // leaving
            if (status !== 'closed') {
                // already set to 'closing' in closeModal; finish to 'closed' after a beat
                tClose.current = setTimeout(() => setStatus('closed'), CLOSE_SETTLE_DELAY_MS);
            }
        }

        return clearAll;
    }, [open, status, setStatus, settleOpen]);

    // Derived, if you want them here:
    /*
    const isClosed = status === 'closed'; 
    const isOpening = status === 'opening';
    const isOpen = status !== 'closed';
    const isClosing = status === 'closing';
    */
    const isFullyOpen = status === 'open';
    const isFullyClosed = status === 'closed';

    return { isFullyOpen, isFullyClosed, onHostLayout };
}
