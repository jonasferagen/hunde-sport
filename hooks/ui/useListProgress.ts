// components/lists/hooks/useListProgress.ts
import type { FlashListProps } from "@shopify/flash-list";
import React from "react";

export function useListProgress<T>(
  total: number,
  config?: Partial<NonNullable<FlashListProps<T>["viewabilityConfig"]>>,
) {
  const [lastVisibleIndex, setLastVisibleIndex] = React.useState(-1);

  const viewabilityConfig = React.useMemo(
    () => ({ itemVisiblePercentThreshold: 50, ...config }),
    [config],
  );

  const onViewableItemsChanged = React.useRef<
    NonNullable<FlashListProps<T>["onViewableItemsChanged"]>
  >(({ viewableItems }) => {
    if (!viewableItems?.length) return;
    const max = viewableItems.reduce(
      (acc, vi) => (vi.index != null ? Math.max(acc, vi.index) : acc),
      -1,
    );
    if (max > lastVisibleIndex) setLastVisibleIndex(max);
  });

  const shown = Math.min(lastVisibleIndex + 1, total);
  return { shown, onViewableItemsChanged, viewabilityConfig };
}
