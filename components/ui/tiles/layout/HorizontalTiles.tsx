import React from "react";
import type { StackProps } from "tamagui";

import { HorizontalList } from "@/components/lists/HorizontalList";
import { HSpacer } from "@/components/lists/util/Spacers";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import type { QueryResult } from "@/lib/api/query";
import { spacePx } from "@/lib/theme";
import type { PurchasableProduct } from "@/types";

import { HorizontalTileItem } from "./HorizontalTileItem";

export interface HorizontalTilesProps extends StackProps {
  queryResult: QueryResult<PurchasableProduct>;
  limit: number;
  estimatedItemSize?: number; // tile width
  estimatedItemCrossSize?: number; // tile height
  gapToken?: any;
  padToken?: any;
  leadingInsetToken?: any;
  indicatorWidthToken?: any;
}

export function HorizontalTiles({
  queryResult,
  estimatedItemSize = 160,
  estimatedItemCrossSize = 120,
  gapToken = "$3",
  padToken = "$3",
  leadingInsetToken,
  indicatorWidthToken = "$6",
  ...stackProps
}: HorizontalTilesProps) {
  const {
    items: products,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = queryResult;

  const leadPx = spacePx((leadingInsetToken ?? padToken) as string);
  const padPx = spacePx(padToken as string);
  const gapPx = spacePx(gapToken as string);

  const HeaderEl = React.useMemo(() => <HSpacer width={leadPx} />, [leadPx]);
  const FooterEl = React.useMemo(
    () => <HSpacer width={Math.max(padPx - gapPx, 0)} />,
    [padPx, gapPx],
  );
  const { to } = useCanonicalNavigation();

  const renderItem = React.useCallback(
    ({ item, index }: { item: PurchasableProduct; index: number }) => (
      <HorizontalTileItem
        item={item}
        index={index}
        // width/height & spacing
        gapPx={gapPx}
        itemW={estimatedItemSize}
        itemH={estimatedItemCrossSize}
        onPress={() => to("product", item)}
      />
    ),
    [gapPx, estimatedItemSize, estimatedItemCrossSize, to],
  );

  const onEndReached = React.useCallback(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);
  if (!products?.length) return null;
  return (
    <HorizontalList<PurchasableProduct>
      data={products}
      renderItem={renderItem as any} // v2 type OK
      keyExtractor={(p) => String(p.id)}
      headerEl={HeaderEl}
      footerEl={FooterEl}
      snapToInterval={estimatedItemSize + gapPx}
      itemWidth={estimatedItemSize}
      gapPx={gapPx}
      showEdgeFades
      indicatorWidthToken={indicatorWidthToken}
      drawDistance={leadPx + estimatedItemSize * 2}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      containerHeight={estimatedItemCrossSize}
      {...stackProps}
    />
  );
}
