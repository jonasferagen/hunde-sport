// @/hooks/useScreenReady.ts
import { useNavigationProgress } from '@/stores/navigationProgressStore';
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { InteractionManager } from 'react-native';

type ScreenReadyOptions = {
    /** Extra delay after interactions to push heavy work by a frame or two */
    delayMs?: number;
    /** Automatically stop the global nav overlay/progress when ready flips true */
    stopNavProgress?: boolean;
    /** Optional callback when ready flips true (fires once per focus) */
    onReady?: () => void;
};

export function useScreenReady(opts: ScreenReadyOptions = {}) {
    const { delayMs = 50, stopNavProgress = true, onReady } = opts;

    const [ready, setReady] = React.useState(false);
    const stoppedRef = React.useRef(false);

    useFocusEffect(
        React.useCallback(() => {
            setReady(false);
            stoppedRef.current = false;

            let canceled = false;
            const task = InteractionManager.runAfterInteractions(() => {
                if (canceled) return;
                const id = setTimeout(() => {
                    if (canceled) return;
                    setReady(true);
                }, Math.max(0, delayMs));
                // cleanup the timeout if focus changes quickly
                return () => clearTimeout(id);
            });

            return () => {
                canceled = true;
                task.cancel();
            };
        }, [delayMs])
    );

    // When ready flips true, stop overlay once and notify
    React.useEffect(() => {
        if (!ready) return;
        if (stopNavProgress && !stoppedRef.current) {
            useNavigationProgress.getState().stop(); // idempotent, but we guard anyway
            stoppedRef.current = true;
        }
        onReady?.();
    }, [ready, stopNavProgress, onReady]);

    return ready;
}
