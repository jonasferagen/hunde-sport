import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * A custom hook that runs a specified function on a referenced component
 * every time the screen comes into focus.
 *
 * @param onFocus The function to execute on the focused element.
 * @param deps Dependencies for the `useCallback` hook.
 * @returns A ref object to be attached to the target component.
 */
export const useRunOnFocus = <T>(
  onFocus: (element: T) => void,
  deps: React.DependencyList = []
) => {
  const ref = useRef<T>(null);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        if (ref.current) {
          onFocus(ref.current);
        }
      }, 100); // Small delay for screen transitions

      return () => clearTimeout(timer);
    }, deps)
  );

  return ref;
};
