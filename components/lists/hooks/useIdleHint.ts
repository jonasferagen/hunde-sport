// components/lists/hooks/useIdleHint.ts
import React from "react";

import type { BottomMoreHintHandle } from "../BottomMoreHint";

export function useIdleHint(opts: {
  enabled: boolean;
  shown: number;
  autoOnProgressOnly?: boolean; // default true
}) {
  const { enabled, shown, autoOnProgressOnly = true } = opts;
  const hintRef = React.useRef<BottomMoreHintHandle>(null);
  const prevShownRef = React.useRef(0);

  React.useEffect(() => {
    if (!enabled) return;
    if (autoOnProgressOnly && shown > prevShownRef.current) {
      hintRef.current?.kick();
    }
    prevShownRef.current = shown;
  }, [enabled, shown, autoOnProgressOnly]);

  const onAnyScroll = React.useCallback(() => {
    if (!enabled) return;
    if (!autoOnProgressOnly) hintRef.current?.kick();
  }, [enabled, autoOnProgressOnly]);

  return { hintRef, onAnyScroll };
}
