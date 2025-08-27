import { FlashList, FlashListRef } from "@shopify/flash-list";
import React, { JSX } from "react";
import { StyleSheet, View as RNView } from "react-native";
import { SpaceTokens, StackProps, View } from "tamagui";

import {
  ProductAvailabilityStatus,
  ProductPriceSimple,
} from "@/components/features/product/display";
import { EdgeFadesOverlay } from "@/components/ui/EdgeFadesOverlay";
import { THEME_PRICE_TAG } from "@/config/app";
import type { QueryResult } from "@/hooks/data/util";
import { useEdgeFades } from "@/hooks/ui/useEdgeFades";
import { useVisibleItems } from "@/hooks/ui/useVisibleItems";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import { spacePx } from "@/lib/helpers";
import type { PurchasableProduct } from "@/types";

import { ThemedYStack } from "../themed-components";
import { TileBadge } from "./TileBadge";
import { TileFixed } from "./TileFixed";

interface HorizontalTilesProps<T> extends StackProps {
  queryResult: QueryResult<T>;
  limit: number;
  estimatedItemSize?: number; // keep as "itemWidth" for your tiles
  estimatedItemCrossSize?: number; // keep as "itemHeight" for your tiles
  gapToken?: SpaceTokens;
  padToken?: SpaceTokens;
  leadingInsetToken?: SpaceTokens;
  indicatorWidthToken?: SpaceTokens;
}
export function HorizontalTiles({
  queryResult,
  limit,
  estimatedItemSize = 160, // acts as itemWidth (still used by your Tile)
  estimatedItemCrossSize = 120, // acts as itemHeight
  gapToken = "$3",
  padToken = "$3",
  leadingInsetToken,
  indicatorWidthToken = "$6",
  ...props
}: HorizontalTilesProps<PurchasableProduct>): JSX.Element {
  const {
    items: products,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = queryResult;
  if (products.length === 0) return <></>;

  return (
    <HorizontalTilesBody
      products={products}
      loadingState={{
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
      }}
      estimatedItemSize={estimatedItemSize}
      estimatedItemCrossSize={estimatedItemCrossSize}
      gapToken={gapToken}
      padToken={padToken}
      leadingInsetToken={leadingInsetToken}
      indicatorWidthToken={indicatorWidthToken}
      {...props}
    />
  );
}

type BodyProps = StackProps & {
  products: PurchasableProduct[];
  loadingState: {
    isLoading: boolean;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
  };
  estimatedItemSize: number;
  estimatedItemCrossSize: number;
  gapToken: SpaceTokens;
  padToken: SpaceTokens;
  leadingInsetToken?: SpaceTokens;
  indicatorWidthToken?: SpaceTokens;
};

const HorizontalTilesBody: React.FC<BodyProps> = ({
  products,
  loadingState,
  estimatedItemSize,
  estimatedItemCrossSize,
  gapToken,
  padToken,
  leadingInsetToken,
  indicatorWidthToken = "$6",
  ...props
}) => {
  const leadPx = spacePx((leadingInsetToken ?? padToken) as string);
  const padPx = spacePx(padToken as string);
  const gapPx = spacePx(gapToken as string);

  const edges = useEdgeFades("horizontal");
  const { to } = useCanonicalNavigation();
  const {
    state: vis,
    onViewableItemsChanged,
    viewabilityConfig,
  } = useVisibleItems();

  const HeaderSpacer: React.FC = React.useCallback(
    () => <RNView style={{ width: leadPx }} />,
    [leadPx]
  );
  HeaderSpacer.displayName = "HorizontalTilesHeaderSpacer";
  const FooterSpacer: React.FC = React.useCallback(
    () => <RNView style={{ width: Math.max(padPx - gapPx, 0) }} />,
    [padPx, gapPx]
  );
  FooterSpacer.displayName = "HorizontalTilesFooterSpacer";

  const onEndReached = React.useCallback(() => {
    const { isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
      loadingState;
    if (!isLoading && !isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [loadingState]);

  const renderItem = React.useCallback(
    ({ item, index }: { item: PurchasableProduct; index: number }) => (
      <RNView
        style={{
          marginRight: gapPx,
          width: estimatedItemSize,
          height: estimatedItemCrossSize,
        }}
      >
        <TileFixed
          onPress={() => to("product", item)}
          title={item.name}
          image={item.featuredImage}
          w={estimatedItemSize}
          h={estimatedItemCrossSize}
          imagePriority={index < 3 ? "high" : "low"}
          interactive={vis.set.has(index)}
        >
          {!item.availability.isInStock && (
            <ThemedYStack
              bg="$background"
              fullscreen
              pos="absolute"
              o={0.4}
              pointerEvents="none"
            />
          )}

          <TileBadge theme={THEME_PRICE_TAG} corner="tr">
            <ProductAvailabilityStatus
              productAvailability={item.availability}
              showInStock={false}
            />
            <ProductPriceSimple
              productPrices={item.prices}
              productAvailability={item.availability}
              showIcon
            />
          </TileBadge>
        </TileFixed>
      </RNView>
    ),
    [to, vis, estimatedItemSize, estimatedItemCrossSize, gapPx]
  );

  const listRef = React.useRef<FlashListRef<PurchasableProduct>>(null);

  return (
    <View
      style={[styles.container, { height: estimatedItemCrossSize }]}
      onLayout={edges.onLayout}
      mih={estimatedItemCrossSize}
      h={estimatedItemCrossSize}
      {...props}
    >
      <FlashList
        ref={listRef}
        horizontal
        data={products}
        keyExtractor={(p) => String(p.id)}
        renderItem={renderItem}
        ListHeaderComponent={HeaderSpacer}
        ListFooterComponent={FooterSpacer}
        showsHorizontalScrollIndicator={false}
        onScroll={edges.onScroll}
        scrollEventThrottle={32}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={estimatedItemSize + gapPx} // still correct with fixed-size tiles
        disableIntervalMomentum
        nestedScrollEnabled
        drawDistance={leadPx + estimatedItemSize * 2}
        getItemType={() => "product"}
        onContentSizeChange={(w, h) => edges.onContentSizeChange(w, h)}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />

      <EdgeFadesOverlay
        orientation="horizontal"
        visibleStart={edges.atStart}
        visibleEnd={edges.atEnd}
        widthToken={indicatorWidthToken}
        bg="$background"
      />
    </View>
  );
};
HorizontalTilesBody.displayName = "HorizontalTilesBody";

const styles = StyleSheet.create({
  container: { position: "relative" },
});
