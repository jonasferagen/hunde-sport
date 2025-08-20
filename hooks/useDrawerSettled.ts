// hooks/useDrawerSettled.ts
import { useDrawerProgress, useDrawerStatus } from '@react-navigation/drawer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
import { runOnJS, useAnimatedReaction, useSharedValue, type SharedValue } from 'react-native-reanimated';

type Options = {
    eps?: number;
    readyDelay?: 'none' | 'interactions';
};

export function useDrawerSettled(opts: Options = {}) {
    const { eps = 0.001, readyDelay = 'none' } = opts;

    const status = useDrawerStatus(); // 'open' | 'closed'
    const progress = useDrawerProgress() as unknown as SharedValue<number> | undefined;

    // seed from status (covers hot reload when already open)
    const initiallyOpen = status === 'open';

    const [isFullyOpen, setIsFullyOpen] = useState(initiallyOpen);
    const [isFullyClosed, setIsFullyClosed] = useState(!initiallyOpen);

    const openedOnceRef = useRef(initiallyOpen);
    const [openedOnce, setOpenedOnce] = useState(initiallyOpen);

    const [readyForHeavyMount, setReady] = useState(initiallyOpen);
    const queueReadyUpdate = useMemo(
        () => () => {
            if (readyDelay === 'interactions') {
                InteractionManager.runAfterInteractions(() => setReady(true));
            } else {
                setReady(true);
            }
        },
        [readyDelay]
    );

    // JS helper (runs only on JS, can safely touch refs/state)
    const markOpenedOnce = useMemo(
        () => () => {
            if (!openedOnceRef.current) {
                openedOnceRef.current = true;
                setOpenedOnce(true);
                queueReadyUpdate();
            }
        },
        [queueReadyUpdate]
    );

    // Fallback + initial sync from status (no progress available on web or edge cases)
    useEffect(() => {
        const atOpen = status === 'open';
        setIsFullyOpen(atOpen);
        setIsFullyClosed(!atOpen);
        if (atOpen) markOpenedOnce();
    }, [status, markOpenedOnce]);

    // UI-thread bookkeeping: use a SharedValue to avoid touching JS refs in the worklet
    const openedOnceSV = useSharedValue(initiallyOpen ? 1 : 0);

    useAnimatedReaction(
        () => (progress ? progress.value : undefined),
        (p, prev) => {
            'worklet';
            if (p === undefined) return;

            const atOpen = p >= 1 - eps;
            const atClosed = p <= eps;

            // initial call
            if (prev === undefined || prev === null) {
                runOnJS(setIsFullyOpen)(atOpen);
                runOnJS(setIsFullyClosed)(atClosed);
                if (atOpen && openedOnceSV.value === 0) {
                    openedOnceSV.value = 1;
                    runOnJS(markOpenedOnce)();
                }
                return;
            }

            const wasAtOpen = prev >= 1 - eps;
            if (atOpen !== wasAtOpen) {
                runOnJS(setIsFullyOpen)(atOpen);
                if (atOpen && openedOnceSV.value === 0) {
                    openedOnceSV.value = 1;
                    runOnJS(markOpenedOnce)();
                }
            }

            const wasAtClosed = prev <= eps;
            if (atClosed !== wasAtClosed) {
                runOnJS(setIsFullyClosed)(atClosed);
            }
        }
    );

    return { isFullyOpen, isFullyClosed, openedOnce, readyForHeavyMount };
}
