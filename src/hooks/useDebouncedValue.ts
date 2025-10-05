// @/hooks/useDebouncedValue.ts
import { useEffect, useRef, useState } from 'react';

/**
 * Debounce any changing value.
 * - Returns the debounced value.
 * - Clears timers on unmount or value changes.
 * - Optional equality function to skip redundant updates.
 */
export function useDebouncedValue<T>(
    value: T,
    delay = 250,
    equalityFn: (a: T, b: T) => boolean = Object.is
): T {
    const [debounced, setDebounced] = useState<T>(value);
    const latest = useRef(value);

    useEffect(() => {
        // If value didn't actually change by equality, skip scheduling
        if (equalityFn(value, latest.current)) return;

        latest.current = value;
        const id = setTimeout(() => setDebounced(latest.current), Math.max(0, delay));
        return () => clearTimeout(id);
    }, [value, delay, equalityFn]);

    return debounced;
}
