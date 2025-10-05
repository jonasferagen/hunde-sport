// components/lists/VerticalList.tsx
import {
  FlashList,
  type FlashListProps,
  type ListRenderItem as FlashListRenderItem,
} from "@shopify/flash-list";
import React, { useMemo, useState } from "react";
import { View } from "tamagui";

type Base<T> = Pick<
  FlashListProps<T>,
  | "onEndReached"
  | "onEndReachedThreshold"
  | "keyExtractor"
  | "drawDistance"
  | "contentContainerStyle"
  | "showsVerticalScrollIndicator"
  | "onScroll"
  | "scrollEventThrottle"
  | "onViewableItemsChanged"
  | "viewabilityConfig"
>;

interface VerticalListProps<T> extends Base<T> {
  data: readonly T[];
  renderItem: FlashListRenderItem<T>;
  ListFooterComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
}

export function VerticalList<T>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold = 0.8,
  ListFooterComponent,
  ListEmptyComponent,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  onScroll,
  scrollEventThrottle = 32,
  onViewableItemsChanged,
  viewabilityConfig,
}: VerticalListProps<T>) {
  const prefetchFactor = 2;
  const [vh, setVh] = useState(0); // list viewport height

  const drawDistance = useMemo(
    () => Math.max(800, Math.round(vh * prefetchFactor)),
    [vh, prefetchFactor],
  );

  const handleLayout = React.useCallback((e: any) => {
    setVh(e.nativeEvent.layout.height);
  }, []);

  return (
    <View f={1} onLayout={handleLayout}>
      <FlashList
        data={data as T[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={ListFooterComponent ?? null}
        ListEmptyComponent={ListEmptyComponent ?? null}
        contentContainerStyle={contentContainerStyle}
        drawDistance={drawDistance}
        removeClippedSubviews={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}
