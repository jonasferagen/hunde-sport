// ProductRail.tsx
import React from "react";
import { type SpaceTokens, type StackProps, Theme } from "tamagui";

import { HorizontalTiles } from "@/components/ui/tile/HorizontalTiles";
import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from "@/config/app";
import {
  useDiscountedProducts,
  useFeaturedProducts,
  useProductsByIds,
  useRecentProducts,
} from "@/hooks/data/product/queries";
import type { QueryResult } from "@/lib/query/query";
import type { PurchasableProduct } from "@/types";

type UseProducts = () => QueryResult<PurchasableProduct>;

type ProductRailProps = StackProps & {
  useQuery: UseProducts;
  limit?: number;
  leadingInsetToken?: SpaceTokens;
  gapToken?: SpaceTokens;
  padToken?: SpaceTokens;
};

export const ProductRail: React.FC<ProductRailProps> = ({
  useQuery,
  limit = 4,
  leadingInsetToken = "$3",
  gapToken = "$3",
  padToken = "$3",
  theme,
  ...stackProps
}) => {
  const queryResult = useQuery();

  return (
    <Theme name={theme || null}>
      <HorizontalTiles
        queryResult={queryResult}
        limit={limit}
        estimatedItemSize={PRODUCT_TILE_WIDTH as number}
        estimatedItemCrossSize={PRODUCT_TILE_HEIGHT as number}
        gapToken={gapToken}
        padToken={padToken}
        leadingInsetToken={leadingInsetToken}
        h={PRODUCT_TILE_HEIGHT}
        {...stackProps}
      />
    </Theme>
  );
};

export const RecentProducts = (p: StackProps) => (
  <ProductRail {...p} useQuery={useRecentProducts} />
);

export const DiscountedProducts = (p: StackProps) => (
  <ProductRail {...p} useQuery={useDiscountedProducts} />
);

export const FeaturedProducts = (p: StackProps) => (
  <ProductRail {...p} useQuery={useFeaturedProducts} />
);

// Debug keeps the API: wrap in a custom hook to satisfy Rules of Hooks
const useDebugProducts = () => useProductsByIds([27445, 26995]);

//   useProductsByIds([41956, 27003, 246557, 35961, 27445, 26995]);

export const DebugProducts = (p: StackProps) => (
  <ProductRail {...p} useQuery={useDebugProducts} />
);
