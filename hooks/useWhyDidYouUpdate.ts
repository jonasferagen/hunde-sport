// useWhyDidYouUpdate.ts
import { useEffect, useRef } from 'react';

export function useWhyDidYouUpdate<T extends Record<string, any>>(
  name: string,
  props: T
) {
  const prev = useRef<T>(props);
  useEffect(() => {
    if (prev.current === props) return;
    const all = Object.keys({ ...prev.current, ...props });
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    for (const k of all) {
      if (prev.current[k] !== props[k]) {
        changes[k] = { from: prev.current[k], to: props[k] };
      }
    }
    if (Object.keys(changes).length) {
      // eslint-disable-next-line no-console
      console.log(`[WDYU] ${name}`, changes);
    }
    prev.current = props;
  });
}
