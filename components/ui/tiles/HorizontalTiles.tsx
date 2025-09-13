import { FlashList, type FlashListRef } from "@shopify/flash-list";
import React, { type JSX } from "react";
import { View as RNView } from "react-native";
import type { SpaceTokens, StackProps } from "tamagui";

import { ProductAvailabilityStatus, ProductPrice } from "@/components/features/product/ui";
import { TileBadge } from "@/components/ui/Badge";
import { ThemedYStack } from "@/components/ui/themed";
import { EdgeFadesOverlay } from "@/components/widgets/EdgeFadesOverlay";
import { THEME_PRICE_TAG } from "@/config/app";
import { useEdgeFades } from "@/hooks/ui/useEdgeFades";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import type { QueryResult } from "@/lib/api/query";
import { spacePx } from "@/lib/theme";
import { Purchasable, type PurchasableProduct } from "@/types";

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
  const { items: products, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = queryResult;
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

  /*
  const {
    state: vis,
    onViewableItemsChanged,
    viewabilityConfig,
  } = useVisibleItems();
*/
  const HeaderSpacer: React.FC = React.useCallback(() => <RNView style={{ width: leadPx }} />, [leadPx]);
  HeaderSpacer.displayName = "HorizontalTilesHeaderSpacer";
  const FooterSpacer: React.FC = React.useCallback(() => <RNView style={{ width: Math.max(padPx - gapPx, 0) }} />, [padPx, gapPx]);
  FooterSpacer.displayName = "HorizontalTilesFooterSpacer";

  const onEndReached = React.useCallback(() => {
    const { isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = loadingState;
    if (!isLoading && !isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [loadingState]);

  const { to } = useCanonicalNavigation();

  const renderItem = React.useCallback(
    ({ item, index }: { item: PurchasableProduct; index: number }) => {
      const purchasable = Purchasable.create({ product: item });

      return (
        <RNView
          style={{
            marginRight: gapPx,
            width: estimatedItemSize,
            height: estimatedItemCrossSize,
          }}>
          <TileFixed
            onPress={() => to("product", item)}
            title={item.name}
            image={item.featuredImage}
            w={estimatedItemSize}
            h={estimatedItemCrossSize}
            imagePriority={index < 3 ? "high" : "low"}
            // interactive={vis.set.has(index) /* or something derived from vp */}
          >
            {!item.availability.isInStock && <ThemedYStack bg="$background" fullscreen pos="absolute" o={0.4} pointerEvents="none" />}

            <TileBadge theme={THEME_PRICE_TAG} corner="tr">
              <ProductAvailabilityStatus productAvailability={item.availability} showInStock={false} />
              <ProductPrice purchasable={purchasable} showIcon />
            </TileBadge>
          </TileFixed>
        </RNView>
      );
    },
    [gapPx, estimatedItemSize, estimatedItemCrossSize, to]
  );

  const listRef = React.useRef<FlashListRef<PurchasableProduct>>(null);

  return (
    <ThemedYStack
      style={[{ position: "relative", height: estimatedItemCrossSize }]}
      onLayout={edges.onLayout}
      mih={estimatedItemCrossSize}
      h={estimatedItemCrossSize}
      {...props}>
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
        //  onViewableItemsChanged={onViewableItemsChanged}
        //  viewabilityConfig={viewabilityConfig}
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

      <EdgeFadesOverlay orientation="horizontal" visibleStart={edges.atStart} visibleEnd={edges.atEnd} widthToken={indicatorWidthToken} bg="$background" />
    </ThemedYStack>
  );
};
