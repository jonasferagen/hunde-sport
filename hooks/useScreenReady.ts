// useScreenReady.ts
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { InteractionManager } from 'react-native';

export function useScreenReady(delayMs = 0) {
    const [ready, setReady] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setReady(false);
            let canceled = false;
            const task = InteractionManager.runAfterInteractions(() => {
                if (canceled) return;
                if (delayMs) setTimeout(() => !canceled && setReady(true), delayMs);
                else setReady(true);
            });
            return () => {
                canceled = true;
                task.cancel();
            };
        }, [delayMs])
    );

    return ready;
}
