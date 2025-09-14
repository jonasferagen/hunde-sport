import {
  FlashList,
  type FlashListRef,
  type ListRenderItem,
} from "@shopify/flash-list";
import React, { type ReactElement } from "react";

import { ThemedYStack } from "@/components/ui/themed";
import { EdgeFadesOverlay } from "@/components/widgets/EdgeFadesOverlay";
import type { PurchasableProduct } from "@/types";

export interface HorizontalTilesListProps {
  listProps: {
    products: PurchasableProduct[];
    renderItem: ListRenderItem<PurchasableProduct>;
    keyExtractor: (p: PurchasableProduct) => string;
    headerEl?: ReactElement | null;
    footerEl?: ReactElement | null;
    onScroll: (e: any) => void;
    onContentSizeChange: (w: number, h: number) => void;
    onEndReached: () => void;
    snapInterval: number;
    drawDistance: number;
  };
  overlayProps: {
    indicatorWidthToken: any;
    atStart: boolean;
    atEnd: boolean;
  };
  containerProps?: any; // forwarded StackProps from caller
}

export function HorizontalTilesList({
  listProps,
  overlayProps,
  containerProps,
}: HorizontalTilesListProps) {
  const listRef = React.useRef<FlashListRef<PurchasableProduct>>(null);

  return (
    <ThemedYStack {...containerProps}>
      <FlashList
        ref={listRef}
        horizontal
        data={listProps.products}
        keyExtractor={listProps.keyExtractor}
        renderItem={listProps.renderItem}
        ListHeaderComponent={listProps.headerEl}
        ListFooterComponent={listProps.footerEl}
        showsHorizontalScrollIndicator={false}
        onScroll={listProps.onScroll}
        scrollEventThrottle={32}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={listProps.snapInterval}
        disableIntervalMomentum
        nestedScrollEnabled
        drawDistance={listProps.drawDistance}
        getItemType={() => "product"}
        onContentSizeChange={listProps.onContentSizeChange}
        onEndReached={listProps.onEndReached}
        onEndReachedThreshold={0.5}
      />

      <EdgeFadesOverlay
        orientation="horizontal"
        visibleStart={overlayProps.atStart}
        visibleEnd={overlayProps.atEnd}
        widthToken={overlayProps.indicatorWidthToken}
        bg="$background"
      />
    </ThemedYStack>
  );
}
