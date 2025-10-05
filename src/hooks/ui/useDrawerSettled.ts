// hooks/useDrawerSettled.ts
import { useDrawerProgress, useDrawerStatus } from "@react-navigation/drawer";
import { useEffect } from "react";
import {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

import { type DrawerStatus, useDrawerStore } from "@/stores/ui/drawerStore";

type Options = { eps?: number };

// Mount once near the Drawer
export function useDrawerSettled({ eps = 0.001 }: Options = {}) {
  const statusCoarse = useDrawerStatus(); // 'open' | 'closed' (coarse)
  const progress = useDrawerProgress() as unknown as
    | SharedValue<number>
    | undefined;

  const setStatus = useDrawerStore.getState().setStatus;
  const markHasOpened = useDrawerStore.getState().markHasOpened;

  const { status, hasOpened } = useDrawerStore(
    useShallow((s) => ({ status: s.status, hasOpened: s.hasOpened })),
  );

  // Track “ever opened” with UI-thread guard
  const hasOpenedSV = useSharedValue(statusCoarse === "open" ? 1 : 0);

  // Fallback: if progress is unavailable (web / first mount), seed from coarse status.
  useEffect(() => {
    if (!progress) {
      const seed: "open" | "closed" =
        statusCoarse === "open" ? "open" : "closed";
      if (seed !== status) {
        setStatus(seed);
      }
      if (seed === "open" && !hasOpened) {
        markHasOpened();
      }
    }
  }, [progress, statusCoarse, status, setStatus, hasOpened, markHasOpened]);

  // Precise updates from native progress
  useAnimatedReaction(
    () => (progress ? progress.value : undefined),
    (p, prev) => {
      "worklet";
      if (p === undefined) return;

      const atOpen = p >= 1 - eps;
      const atClosed = p <= eps;
      const delta = prev == null ? 0 : p - prev;

      // Decide status
      let next: "closed" | "opening" | "open" | "closing";
      if (atClosed) next = "closed";
      else if (atOpen) next = "open";
      else next = delta >= 0 ? "opening" : "closing";

      // Push to JS only on change
      if (prev == null || next !== (undefined as any)) {
        runOnJS(pushStatusIfChanged)(next);
        if (atOpen && hasOpenedSV.value === 0) {
          hasOpenedSV.value = 1;
          runOnJS(markHasOpened)();
        }
      }
    },
  );

  function pushStatusIfChanged(next: DrawerStatus) {
    const current = useDrawerStore.getState().status;
    if (current !== next) {
      setStatus(next);
    }
  }

  return { status, isFullyClosed: status === "closed", hasOpened };
}
