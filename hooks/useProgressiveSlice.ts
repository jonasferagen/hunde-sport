// hooks/useProgressiveSlice.ts
import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

export function useProgressiveSlice<T>(
    items: T[],
    first = 8,        // initial count
    step = 8,         // how many to add per step
    delayMs = 120     // delay between steps (after interactions)
) {
    const [count, setCount] = useState(Math.min(first, items.length));

    useEffect(() => {
        setCount(Math.min(first, items.length)); // reset when items change
        let canceled = false;
        const task = InteractionManager.runAfterInteractions(() => {
            if (canceled) return;
            const id = setTimeout(function tick() {
                setCount((c) => {
                    const next = Math.min(c + step, items.length);
                    if (next === c) return c;
                    // schedule next bump
                    setTimeout(tick, delayMs);
                    return next;
                });
            }, delayMs);
            return () => clearTimeout(id);
        });
        return () => {
            canceled = true;
            task.cancel();
        };
    }, [items, first, step, delayMs]);

    return items.slice(0, count);
}
