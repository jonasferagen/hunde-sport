// File: components/tiles/useHorizontalTiles.ts
import React from "react";
import { View as RNView } from "react-native";
import type { StackProps } from "tamagui";

import { useEdgeFades } from "@/hooks/ui/useEdgeFades";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import type { QueryResult } from "@/lib/api/query";
import { spacePx } from "@/lib/theme";
import type { PurchasableProduct } from "@/types";

import { HorizontalTileItem } from "./HorizontalTileItem";
import type { HorizontalTilesProps } from "./HorizontalTiles";

export function useHorizontalTiles({
  queryResult,
  estimatedItemSize = 160,
  estimatedItemCrossSize = 120,
  gapToken = "$3",
  padToken = "$3",
  leadingInsetToken,
  indicatorWidthToken = "$6",
  ...containerRest
}: HorizontalTilesProps) {
  const {
    items: products,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = queryResult as QueryResult<PurchasableProduct>;

  const leadPx = spacePx((leadingInsetToken ?? padToken) as string);
  const padPx = spacePx(padToken as string);
  const gapPx = spacePx(gapToken as string);

  const edges = useEdgeFades("horizontal");
  const { to } = useCanonicalNavigation();

  const onEndReached = React.useCallback(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const headerEl = React.useMemo(
    () => <RNView style={{ width: leadPx }} />,
    [leadPx],
  );
  const footerEl = React.useMemo(
    () => <RNView style={{ width: Math.max(padPx - gapPx, 0) }} />,
    [padPx, gapPx],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: PurchasableProduct; index: number }) => (
      <HorizontalTileItem
        item={item}
        index={index}
        gapPx={gapPx}
        itemW={estimatedItemSize}
        itemH={estimatedItemCrossSize}
        onPress={() => to("product", item)}
      />
    ),
    [gapPx, estimatedItemSize, estimatedItemCrossSize, to],
  );

  return {
    containerProps: {
      ...containerRest,
      style: [
        { position: "relative", height: estimatedItemCrossSize },
        containerRest.style,
      ],
      onLayout: edges.onLayout,
      mih: estimatedItemCrossSize,
      h: estimatedItemCrossSize,
    } as StackProps,
    listProps: {
      products,
      renderItem,
      keyExtractor: (p: PurchasableProduct) => String(p.id),
      headerEl,
      footerEl,
      onScroll: edges.onScroll,
      onContentSizeChange: edges.onContentSizeChange,
      onEndReached,
      snapInterval: estimatedItemSize + gapPx,
      drawDistance: leadPx + estimatedItemSize * 2,
    },
    overlayProps: {
      indicatorWidthToken,
      atStart: edges.atStart,
      atEnd: edges.atEnd,
    },
  } as const;
}
