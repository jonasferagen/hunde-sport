// hooks/useDrawerSettled.ts
import { useDrawerProgress, useDrawerStatus } from '@react-navigation/drawer';
import { useEffect, useMemo, useRef } from 'react';
import { runOnJS, useAnimatedReaction, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { useDrawerStore } from '@/stores/drawerStore';
import { useShallow } from 'zustand/react/shallow';

type Options = { eps?: number; };

// Mount this hook once near the <Drawer/>.
// It drives drawerStore: isFullyClosed + hasOpened.
export function useDrawerSettled(opts: Options = {}) {
    const { eps = 0.001 } = opts;

    const status = useDrawerStatus(); // 'open' | 'closed'
    const progress = useDrawerProgress() as unknown as SharedValue<number> | undefined;

    const initiallyOpen = status === 'open';

    // local refs to avoid redundant store writes
    const lastFullyClosedRef = useRef<boolean>(!initiallyOpen);
    const hasOpenedRef = useRef<boolean>(initiallyOpen);

    // grab stable setters without subscribing this component to store changes
    const setFullyClosed = useDrawerStore.getState().setFullyClosed;
    const markHasOpened = useDrawerStore.getState().markHasOpened;

    // (optional) if you want to also read the store booleans here:
    const { isFullyClosed, hasOpened } = useDrawerStore(
        useShallow((s) => ({ isFullyClosed: s.isFullyClosed, hasOpened: s.hasOpened }))
    );

    // Fallback/initial sync from status (covers web / no progress cases)
    useEffect(() => {
        const atOpen = status === 'open';
        const atClosed = !atOpen;

        if (lastFullyClosedRef.current !== atClosed) {
            lastFullyClosedRef.current = atClosed;
            setFullyClosed(atClosed);
        }

        if (atOpen && !hasOpenedRef.current) {
            hasOpenedRef.current = true;
            markHasOpened();
        }
    }, [status, setFullyClosed, markHasOpened]);

    // UI-thread precise updates via progress (native animation signal)
    const hasOpenedSV = useSharedValue(initiallyOpen ? 1 : 0);

    useAnimatedReaction(
        () => (progress ? progress.value : undefined),
        (p, prev) => {
            'worklet';
            if (p === undefined) return;

            const atOpen = p >= 1 - eps;
            const atClosed = p <= eps;

            // initial call
            if (prev === undefined || prev === null) {
                runOnJS(maybeSetClosed)(atClosed);
                if (atOpen && hasOpenedSV.value === 0) {
                    hasOpenedSV.value = 1;
                    runOnJS(maybeMarkOpened)();
                }
                return;
            }

            const wasAtClosed = prev <= eps;
            if (atClosed !== wasAtClosed) {
                runOnJS(maybeSetClosed)(atClosed);
            }

            const wasAtOpen = prev >= 1 - eps;
            if (atOpen !== wasAtOpen && atOpen && hasOpenedSV.value === 0) {
                hasOpenedSV.value = 1;
                runOnJS(maybeMarkOpened)();
            }
        }
    );

    // These helpers run on JS to avoid redundant store writes
    function maybeSetClosed(v: boolean) {
        if (lastFullyClosedRef.current !== v) {
            lastFullyClosedRef.current = v;
            setFullyClosed(v);
        }
    }

    function maybeMarkOpened() {
        if (!hasOpenedRef.current) {
            hasOpenedRef.current = true;
            markHasOpened();
        }
    }

    // Optional: return the live values for convenience when used inside the same component tree
    return { isFullyClosed, hasOpened };
}
