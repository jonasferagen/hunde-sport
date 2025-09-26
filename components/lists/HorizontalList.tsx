import {
  FlashList,
  type FlashListProps,
  type FlashListRef,
  type ListRenderItem as FlashListRenderItem,
} from "@shopify/flash-list";
import React from "react";

import { ThemedYStack } from "@/components/ui/themed";
import { EdgeFadesOverlay } from "@/components/widgets/EdgeFadesOverlay";
import { useEdgeFades } from "@/hooks/ui/useEdgeFades";

type Base<T> = Pick<
  FlashListProps<T>,
  | "keyExtractor"
  | "onEndReached"
  | "onEndReachedThreshold"
  | "drawDistance"
  | "contentContainerStyle"
  | "onScroll"
  | "scrollEventThrottle"
  | "getItemType"
>;

interface HorizontalListProps<T> extends Base<T> {
  data: readonly T[];
  renderItem: FlashListRenderItem<T>;

  /** Snap config: set explicitly OR pass itemWidth+gapPx to compute */
  snapToInterval?: number;
  itemWidth?: number;
  gapPx?: number;

  /** Edge fades */
  showEdgeFades?: boolean;
  indicatorWidthToken?: any;

  /** Header / Footer as elements (simpler than ComponentType) */
  headerEl?: React.ReactElement | null;
  footerEl?: React.ReactElement | null;

  /** Constrain height to match item cross size (optional) */
  containerHeight?: number;

  /** Ref passthrough if needed */
  listRef?: React.RefObject<FlashListRef<T>>;
}

export function HorizontalList<T>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold = 0.5,
  drawDistance,
  contentContainerStyle,
  onScroll,
  scrollEventThrottle = 32,
  getItemType,
  snapToInterval,
  itemWidth,
  gapPx,
  showEdgeFades = true,
  indicatorWidthToken = "$6",
  headerEl,
  footerEl,
  containerHeight,
  listRef,
}: HorizontalListProps<T>) {
  const edges = useEdgeFades("horizontal");
  const snapInterval =
    snapToInterval ??
    (itemWidth != null && gapPx != null ? itemWidth + gapPx : undefined);

  return (
    <ThemedYStack
      style={
        containerHeight
          ? [{ position: "relative", height: containerHeight }]
          : [{ position: "relative" }]
      }
      onLayout={edges.onLayout}
      h={containerHeight}
    >
      <FlashList
        ref={listRef as any}
        horizontal
        data={data as T[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={headerEl ?? null}
        ListFooterComponent={footerEl ?? null}
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          edges.onScroll(e);
          onScroll?.(e);
        }}
        scrollEventThrottle={scrollEventThrottle}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={snapInterval}
        disableIntervalMomentum
        nestedScrollEnabled
        drawDistance={drawDistance}
        getItemType={getItemType}
        onContentSizeChange={edges.onContentSizeChange}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        contentContainerStyle={contentContainerStyle}
      />

      {showEdgeFades && (
        <EdgeFadesOverlay
          orientation="horizontal"
          visibleStart={edges.atStart}
          visibleEnd={edges.atEnd}
          widthToken={indicatorWidthToken}
          bg="$background"
        />
      )}
    </ThemedYStack>
  );
}
