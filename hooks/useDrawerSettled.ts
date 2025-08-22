// hooks/useDrawerSettled.ts
import { useDrawerProgress, useDrawerStatus } from '@react-navigation/drawer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { runOnJS, useAnimatedReaction, useSharedValue, type SharedValue } from 'react-native-reanimated';

type Options = { eps?: number };

export function useDrawerSettled(opts: Options = {}) {
    const { eps = 0.001 } = opts;

    const status = useDrawerStatus(); // 'open' | 'closed'
    const progress = useDrawerProgress() as unknown as SharedValue<number> | undefined;

    const initiallyOpen = status === 'open';

    const [isFullyOpen, setIsFullyOpen] = useState(initiallyOpen);
    const [isFullyClosed, setIsFullyClosed] = useState(!initiallyOpen);

    // one-shot
    const hasOpenedRef = useRef(initiallyOpen);
    const [hasOpened, setHasOpened] = useState(initiallyOpen);

    const markHasOpened = useMemo(
        () => () => {
            if (!hasOpenedRef.current) {
                hasOpenedRef.current = true;
                setHasOpened(true);
            }
        },
        []
    );

    // fallback / initial sync
    useEffect(() => {
        const atOpen = status === 'open';
        setIsFullyOpen(atOpen);
        setIsFullyClosed(!atOpen);
        if (atOpen) markHasOpened();
    }, [status, markHasOpened]);

    const hasOpenedSV = useSharedValue(initiallyOpen ? 1 : 0);

    useAnimatedReaction(
        () => (progress ? progress.value : undefined),
        (p, prev) => {
            'worklet';
            if (p === undefined) return;

            const atOpen = p >= 1 - eps;
            const atClosed = p <= eps;

            if (prev === undefined || prev === null) {
                runOnJS(setIsFullyOpen)(atOpen);
                runOnJS(setIsFullyClosed)(atClosed);
                if (atOpen && hasOpenedSV.value === 0) {
                    hasOpenedSV.value = 1;
                    runOnJS(markHasOpened)();
                }
                return;
            }

            const wasAtOpen = prev >= 1 - eps;
            if (atOpen !== wasAtOpen) {
                runOnJS(setIsFullyOpen)(atOpen);
                if (atOpen && hasOpenedSV.value === 0) {
                    hasOpenedSV.value = 1;
                    runOnJS(markHasOpened)();
                }
            }

            const wasAtClosed = prev <= eps;
            if (atClosed !== wasAtClosed) {
                runOnJS(setIsFullyClosed)(atClosed);
            }
        }
    );

    return { isFullyOpen, isFullyClosed, hasOpened };
}
