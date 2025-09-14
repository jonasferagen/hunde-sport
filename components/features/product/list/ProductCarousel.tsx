import React from "react";
import type { SpaceTokens, StackProps } from "tamagui";
import { Theme } from "tamagui";

import {
  ProductAvailabilityStatus,
  ProductPrice,
} from "@/components/features/product/ui";
import { HorizontalList } from "@/components/lists/HorizontalList";
import { HSpacer } from "@/components/lists/util/Spacers";
import { TileBadge } from "@/components/ui/Badge";
import { ThemedYStack } from "@/components/ui/themed";
import { FixedTile } from "@/components/ui/tiles/FixedTile";
import {
  PRODUCT_TILE_HEIGHT,
  PRODUCT_TILE_WIDTH,
  THEME_PRICE_TAG,
} from "@/config/app";
import {
  useDebugProducts,
  useDiscountedProducts,
  useFeaturedProducts,
  useRecentProducts,
} from "@/hooks/api/data/product/queries";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import type { QueryResult } from "@/lib/api/query";
import { spacePx } from "@/lib/theme";
import { Purchasable, type PurchasableProduct } from "@/types";

type AnyProductsHook<Args extends any[] = any[]> = (
  ...args: Args
) => QueryResult<PurchasableProduct>;

type ProductCarouselProps<Args extends any[] = any[]> = StackProps & {
  useQuery: AnyProductsHook<Args>;
  useQueryArgs?: Args;

  leadingInsetToken?: SpaceTokens;
  gapToken?: SpaceTokens;
  padToken?: SpaceTokens;

  itemW?: number; // defaults to PRODUCT_TILE_WIDTH
  itemH?: number; // defaults to PRODUCT_TILE_HEIGHT
  indicatorWidthToken?: SpaceTokens;
};

export function ProductCarousel<Args extends any[] = any[]>({
  useQuery,
  useQueryArgs,
  leadingInsetToken = "$3",
  gapToken = "$3",
  padToken = "$3",
  itemW = PRODUCT_TILE_WIDTH as number,
  itemH = PRODUCT_TILE_HEIGHT as number,
  indicatorWidthToken = "$6",
  theme,
  ...stackProps
}: ProductCarouselProps<Args>) {
  const {
    items: products,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useQuery(...(useQueryArgs ?? ([] as unknown as Args)));

  const leadPx = spacePx((leadingInsetToken ?? padToken) as string);
  const padPx = spacePx(padToken as string);
  const gapPx = spacePx(gapToken as string);

  const headerEl = React.useMemo(() => <HSpacer width={leadPx} />, [leadPx]);
  const footerEl = React.useMemo(
    () => <HSpacer width={Math.max(padPx - gapPx, 0)} />,
    [padPx, gapPx],
  );

  const { to } = useCanonicalNavigation();

  const renderItem = React.useCallback(
    ({ item, index }: { item: PurchasableProduct; index: number }) => (
      <ProductTile
        product={item}
        index={index}
        gapPx={gapPx}
        w={itemW}
        h={itemH}
        onPress={() => to("product", item)}
      />
    ),
    [gapPx, itemW, itemH, to],
  );

  const onEndReached = React.useCallback(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);
  if (!products?.length) return null;
  return (
    <Theme name={theme || null}>
      <HorizontalList<PurchasableProduct>
        data={products}
        renderItem={renderItem as any}
        keyExtractor={(p) => String(p.id)}
        headerEl={headerEl}
        footerEl={footerEl}
        snapToInterval={itemW + gapPx}
        itemWidth={itemW}
        gapPx={gapPx}
        showEdgeFades
        indicatorWidthToken={indicatorWidthToken}
        drawDistance={leadPx + itemW * 2}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        containerHeight={itemH}
        {...stackProps}
      />
    </Theme>
  );
}

const ProductTile: React.FC<{
  product: PurchasableProduct;
  index: number;
  gapPx: number;
  w: number;
  h: number;
  onPress: () => void;
}> = ({ product, index, gapPx, w, h, onPress }) => {
  const purchasable = Purchasable.create({ product });
  return (
    <ThemedYStack w={w} h={h} mr={gapPx}>
      <FixedTile
        onPress={onPress}
        title={product.name}
        image={product.featuredImage}
        w={w}
        h={h}
        imagePriority={index < 3 ? "high" : "low"}
      >
        {!product.availability.isInStock && (
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
            productAvailability={product.availability}
            showInStock={false}
          />
          <ProductPrice purchasable={purchasable} showIcon />
        </TileBadge>
      </FixedTile>
    </ThemedYStack>
  );
};

export const RecentProducts = (p: StackProps) => (
  <ProductCarousel {...p} useQuery={useRecentProducts} />
);

export const DiscountedProducts = (p: StackProps) => (
  <ProductCarousel {...p} useQuery={useDiscountedProducts} />
);

export const FeaturedProducts = (p: StackProps) => (
  <ProductCarousel {...p} useQuery={useFeaturedProducts} />
);

/** Debug: pass hook + args separately */
export const DebugProducts = (p: StackProps) => (
  <ProductCarousel
    {...p}
    useQuery={useDebugProducts}
    useQueryArgs={[[27445, 26995]]}
  />
);
