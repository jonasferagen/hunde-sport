// hooks/useModalState.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useModalStore } from '@/stores/modalStore';
import { useShallow } from 'zustand/react/shallow';

const OPEN_SETTLE_DELAY_MS = 140;
const CLOSE_SETTLE_DELAY_MS = 50;

export function useModalState() {
    const { open, status, setStatus } = useModalStore(
        useShallow((s) => ({ open: s.open, status: s.status, setStatus: s.setStatus }))
    );

    const [isFullyOpen, setIsFullyOpen] = useState(false);
    const [isFullyClosed, setIsFullyClosed] = useState(!open);

    // one-shot
    const hasOpenedRef = useRef(status === 'open');
    const [hasOpened, setHasOpened] = useState(status === 'open');

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
        raf1.current = requestAnimationFrame(() => {
            raf2.current = requestAnimationFrame(() => {
                setStatus('open');
                setIsFullyOpen(true);
                setIsFullyClosed(false);
                if (!hasOpenedRef.current) {
                    hasOpenedRef.current = true;
                    setHasOpened(true);
                }
            });
        });
    }, [setStatus]);

    // Attach to <Sheet.Frame onLayout={onHostLayout}>
    const onHostLayout = useCallback((_e: LayoutChangeEvent) => {
        if (!open || status !== 'opening') return;
        if (tOpen.current) clearTimeout(tOpen.current);
        tOpen.current = setTimeout(settleOpen, OPEN_SETTLE_DELAY_MS);
    }, [open, status, settleOpen]);

    useEffect(() => {
        clearAll();

        if (open) {
            if (status === 'closed') setStatus('opening');
            setIsFullyOpen(false);
            setIsFullyClosed(false);

            // fallback if layout comes early/missed
            tOpen.current = setTimeout(() => {
                const s = useModalStore.getState();
                if (s.open && s.status === 'opening') settleOpen();
            }, OPEN_SETTLE_DELAY_MS + 60);
        } else {
            setIsFullyOpen(false);
            tClose.current = setTimeout(() => {
                setIsFullyClosed(true);
                if (useModalStore.getState().status !== 'closed') setStatus('closed');
            }, CLOSE_SETTLE_DELAY_MS);
        }

        return clearAll;
    }, [open, status, setStatus, settleOpen]);

    return { isFullyOpen, isFullyClosed, hasOpened, onHostLayout };
}
