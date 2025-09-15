// components/lists/VerticalList.tsx
import {
  FlashList,
  type FlashListProps,
  type ListRenderItem as FlashListRenderItem,
} from "@shopify/flash-list";
import React from "react";
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
  | "getItemType"
  | "onViewableItemsChanged"
  | "viewabilityConfig"
>;

export interface VerticalListProps<T> extends Base<T> {
  data: readonly T[];
  renderItem: FlashListRenderItem<T>;
  ListFooterComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  animateFirstTimeKey?: string | number;
  getStableId?: (item: T) => number | string;
  staggerMod?: number; // default 8
}

export function VerticalList<T>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold = 0.8,
  ListFooterComponent,
  ListEmptyComponent,
  drawDistance = 800,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  onScroll,
  scrollEventThrottle = 32,
  getItemType,
  onViewableItemsChanged,
  viewabilityConfig,
}: VerticalListProps<T>) {
  return (
    <View f={1}>
      <FlashList
        data={data as T[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={ListFooterComponent ?? null}
        ListEmptyComponent={ListEmptyComponent ?? null}
        contentContainerStyle={contentContainerStyle ?? { flexGrow: 1 }}
        drawDistance={drawDistance}
        getItemType={getItemType}
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
