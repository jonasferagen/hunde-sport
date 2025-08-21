// hooks/useVisibleItems.ts
import type { ViewToken } from '@shopify/flash-list';
import React from 'react';

export type VisibleState = {
    set: Set<number>;
    first: number;   // smallest visible index, or -1
    last: number;    // largest visible index, or -1
    count: number;
};

export function useVisibleItems(initial?: number[]): {
    state: VisibleState;
    onViewableItemsChanged: (info: { changed: ViewToken[] }) => void;
    viewabilityConfig: { itemVisiblePercentThreshold: number; minimumViewTime?: number };
} {
    const [state, setState] = React.useState<VisibleState>(() => {
        const s = new Set(initial ?? []);
        const arr = [...s].sort((a, b) => a - b);
        return {
            set: s,
            first: arr[0] ?? -1,
            last: arr[arr.length - 1] ?? -1,
            count: s.size,
        };
    });

    // keep ref-stable callback to avoid extra list rerenders
    const onViewableItemsChanged = React.useRef(
        ({ changed }: { changed: ViewToken[] }) => {
            setState(prev => {
                // mutate a copy, then compute range once
                const nextSet = new Set(prev.set);
                let dirty = false;

                for (const c of changed) {
                    const idx = c.index;
                    if (idx == null) continue;
                    if (c.isViewable) {
                        if (!nextSet.has(idx)) { nextSet.add(idx); dirty = true; }
                    } else {
                        if (nextSet.delete(idx)) dirty = true;
                    }
                }

                if (!dirty) return prev;
                const arr = [...nextSet].sort((a, b) => a - b);
                return {
                    set: nextSet,
                    first: arr[0] ?? -1,
                    last: arr[arr.length - 1] ?? -1,
                    count: nextSet.size,
                };
            });
        }
    ).current;

    const viewabilityConfig = React.useMemo(
        () => ({ itemVisiblePercentThreshold: 50, minimumViewTime: 50 }),
        []
    );

    return { state, onViewableItemsChanged, viewabilityConfig };
}
