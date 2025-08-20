// usePanelSettled.ts
import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import { runOnJS, useAnimatedReaction, type SharedValue } from 'react-native-reanimated';

// hooks/useDrawerSettled.ts
import { useDrawerProgress, useDrawerStatus } from '@react-navigation/drawer';
import { useRef } from 'react';

type Options = {
    eps?: number;                       // threshold for 0/1
    readyDelay?: 'none' | 'interactions'; // when to flip 'readyForHeavyMount'
};

/**
 * Unified drawer "settled" hook.
 * Must be called under a drawer context (inside drawerContent, etc).
 */
export function useDrawerSettled(opts: Options = {}) {
    const { eps = 0.001, readyDelay = 'none' } = opts;

    const status = useDrawerStatus(); // 'open' | 'closed'
    // Progress is a SharedValue<number> on native; on web it may only jump 0/1
    const progress = useDrawerProgress() as unknown as SharedValue<number> | undefined;

    // Seed from status so refresh while open is handled
    const initiallyOpen = status === 'open';
    const [isFullyOpen, setIsFullyOpen] = useState(initiallyOpen);
    const [isFullyClosed, setIsFullyClosed] = useState(!initiallyOpen);

    // “did we ever fully open?” one-shot
    const openedOnceRef = useRef(initiallyOpen);
    const [openedOnce, setOpenedOnce] = useState(initiallyOpen);

    const [readyForHeavyMount, setReady] = useState(initiallyOpen);

    function queueReadyUpdate() {
        if (readyDelay === 'interactions') {
            InteractionManager.runAfterInteractions(() => setReady(true));
        } else {
            setReady(true);
        }
    }

    // Update from status (fallback + initial sync)
    useEffect(() => {
        const atOpen = status === 'open';
        setIsFullyOpen(atOpen);
        setIsFullyClosed(!atOpen);
        if (atOpen && !openedOnceRef.current) {
            openedOnceRef.current = true;
            setOpenedOnce(true);
            queueReadyUpdate();
        }
    }, [status]);

    // Update from progress (UI thread; no reading .value in render)
    useAnimatedReaction(
        () => (progress ? progress.value : undefined),
        (p, prev) => {
            'worklet';
            if (p === undefined) return;

            const atOpen = p >= 1 - eps;
            const atClosed = p <= eps;

            // initial sync (prev undefined on first call)
            if (prev === undefined || prev === null) {
                runOnJS(setIsFullyOpen)(atOpen);
                runOnJS(setIsFullyClosed)(atClosed);
                if (atOpen && !openedOnceRef.current) {
                    openedOnceRef.current = true;
                    runOnJS(setOpenedOnce)(true);
                    runOnJS(queueReadyUpdate)();
                }
                return;
            }

            const wasAtOpen = prev >= 1 - eps;
            if (atOpen !== wasAtOpen) {
                runOnJS(setIsFullyOpen)(atOpen);
                if (atOpen && !openedOnceRef.current) {
                    openedOnceRef.current = true;
                    runOnJS(setOpenedOnce)(true);
                    runOnJS(queueReadyUpdate)();
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

