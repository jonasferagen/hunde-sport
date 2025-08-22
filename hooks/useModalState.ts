// hooks/useModalState.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useModalStore } from '@/stores/modalStore';
import { useShallow } from 'zustand/react/shallow';

const OPEN_SETTLE_DELAY_MS = 1000; // tune to your Sheet animation
const CLOSE_SETTLE_DELAY_MS = 50;  // small buffer

export function useModalState() {
    const { open, status, setStatus } = useModalStore(
        useShallow((s) => ({
            open: s.open,
            status: s.status,       // 'closed' | 'opening' | 'open' | 'closing'
            setStatus: s.setStatus, // state machine control
        }))
    );

    // one-shot flag that becomes true the first time we reach fully open
    const hasOpenedRef = useRef(status === 'open');
    const [hasOpened, setHasOpened] = useState(status === 'open');

    // timers / rAF handles (for settling)
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

    // when we decide “fully open”, set status=open (store) after delay + 2×rAF
    const settleOpen = useCallback(() => {
        raf1.current = requestAnimationFrame(() => {
            raf2.current = requestAnimationFrame(() => {
                setStatus('open');
            });
        });
    }, [setStatus]);

    // host attaches this to <Sheet.Frame onLayout={onHostLayout}>
    const onHostLayout = useCallback(
        (_e: LayoutChangeEvent) => {
            if (!open || status !== 'opening') return;
            if (tOpen.current) clearTimeout(tOpen.current);
            tOpen.current = setTimeout(settleOpen, OPEN_SETTLE_DELAY_MS);
        },
        [open, status, settleOpen]
    );

    // drive the state machine like before (your “old” working logic)
    useEffect(() => {
        clearAll();

        if (open) {
            if (status === 'closed') setStatus('opening');

            // fallback in case onLayout is early/missed
            tOpen.current = setTimeout(() => {
                const s = useModalStore.getState();
                if (s.open && s.status === 'opening') settleOpen();
            }, OPEN_SETTLE_DELAY_MS + 60);
        } else {
            // finishing close → mark closed after a small buffer
            if (status !== 'closed') {
                tClose.current = setTimeout(() => setStatus('closed'), CLOSE_SETTLE_DELAY_MS);
            }
        }

        return clearAll;
    }, [open, status, setStatus, settleOpen]);

    // flip hasOpened exactly when we become fully open
    useEffect(() => {
        if (status === 'open' && !hasOpenedRef.current) {
            hasOpenedRef.current = true;
            setHasOpened(true);
        }
    }, [status]);

    // derived flags from the store (like your working version)
    const isFullyOpen = status === 'open';
    const isFullyClosed = status === 'closed';
    const isVisible = status !== 'closed';
    // (you can also expose isOpening/ isClosing if needed)

    return { isFullyOpen, isFullyClosed, isVisible, hasOpened, onHostLayout };
}
