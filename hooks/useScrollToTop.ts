import { useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';

/**
 * A custom hook that provides a ref for a ScrollView and scrolls it to the top
 * whenever a specified dependency changes.
 *
 * @param dependency The value to watch for changes. When it changes, the scroll view will scroll to the top.
 * @returns A ref object to be attached to a ScrollView component.
 */
export const useScrollToTop = (dependency: unknown) => {
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, [dependency]);

    return scrollRef;
};
