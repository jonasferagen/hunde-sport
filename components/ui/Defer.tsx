import { useIsFocused } from '@react-navigation/native';
import React from 'react';

export function Defer({
    minDelay = 0,
    once = false,
    children,
    enabled: enabledProp,
}: {
    minDelay?: number;
    once?: boolean;
    children: React.ReactNode;
    enabled?: boolean; // optional external control
}) {
    const isFocused = useIsFocused();
    const enabled = enabledProp ?? isFocused;

    const [show, setShow] = React.useState(minDelay === 0);
    const shownOnceRef = React.useRef(false);

    React.useEffect(() => {
        if (!enabled) {
            // Pause/cancel while blurred
            if (!once) setShow(false);
            return;
        }
        if (once && shownOnceRef.current) return;

        const id = setTimeout(() => {
            setShow(true);
            if (once) shownOnceRef.current = true;
        }, minDelay);

        return () => clearTimeout(id);
    }, [enabled, once, minDelay]);

    return show ? <>{children}</> : null;
}
