// useDeferredOpen.ts
import React from 'react';
import { InteractionManager } from 'react-native';

export function useDeferredOpen(deps: any[] = [], delay = 0) {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
        setReady(false);
        const task = InteractionManager.runAfterInteractions(() => {
            if (delay) setTimeout(() => setReady(true), delay);
            else setReady(true);
        });
        return () => task.cancel();
    }, deps); // re-run when modal/product changes
    return ready;
}
