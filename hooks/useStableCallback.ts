/** Alternative to useCallback for creating stable function references */

import React from "react";

export function useStableCallback<T extends (...a: any[]) => any>(fn: T): T {
  const ref = React.useRef(fn);
  React.useLayoutEffect(() => {
    ref.current = fn;
  });
  // stable wrapper; identity never changes
  return React.useMemo(() => ((...args) => ref.current(...args)) as T, []);
}
