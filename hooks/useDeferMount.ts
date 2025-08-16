// hooks/useDeferMount.ts
import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { InteractionManager } from 'react-native';

export function useDeferMount(opts?: { minDelay?: number; once?: boolean }) {
    const { minDelay = 0, once = true } = opts ?? {};
    const isFocused = useIsFocused();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;
        if (!isFocused) {
            if (!once) setMounted(false);
            return;
        }
        let timeout: ReturnType<typeof setTimeout> | undefined;
        const task = InteractionManager.runAfterInteractions(() => {
            const finish = () => !cancelled && setMounted(true);
            if (minDelay > 0) timeout = setTimeout(finish, minDelay);
            else finish();
        });

        return () => {
            cancelled = true;
            task.cancel();
            if (timeout) clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    return mounted;
}
