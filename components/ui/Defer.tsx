
// components/Defer.tsx
import { useDeferMount } from '@/hooks/useDeferMount';
import { JSX } from 'react';

export const Defer = ({
    children,
    fallback = null,
    minDelay,
    once,
}: {
    children: any;
    fallback?: any;
    minDelay?: number;
    once?: boolean;
}): JSX.Element => {
    const ready = useDeferMount({ minDelay, once });
    return ready ? children : fallback;
}
