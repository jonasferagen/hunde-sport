// ProductRail.tsx
import { type SpaceTokens, type StackProps, Theme } from "tamagui";

import { HorizontalTiles } from "@/components/ui/tiles/HorizontalTiles";
import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from "@/config/app";
import { useDebugProducts, useDiscountedProducts, useFeaturedProducts, useRecentProducts } from "@/hooks/api/data/product/queries";
import type { QueryResult } from "@/lib/api/query";
import type { PurchasableProduct } from "@/types";

/** A hook that returns product query results. Args vary per hook. */
type AnyProductsHook<Args extends any[] = any[]> = (...args: Args) => QueryResult<PurchasableProduct>;

type ProductRailProps<Args extends any[] = any[]> = StackProps & {
  /** Pass the hook itself, e.g. `useFeaturedProducts` or `useProductsByIds` */
  useQuery: AnyProductsHook<Args>;
  /** Pass the arguments for that hook (if any). For a single array param, wrap it: `[[1,2,3]]`. */
  useQueryArgs?: Args;

  limit?: number;
  leadingInsetToken?: SpaceTokens;
  gapToken?: SpaceTokens;
  padToken?: SpaceTokens;
};

export function ProductRail<Args extends any[] = any[]>({
  useQuery,
  useQueryArgs,
  limit = 4,
  leadingInsetToken = "$3",
  gapToken = "$3",
  padToken = "$3",
  theme,
  ...stackProps
}: ProductRailProps<Args>) {
  // Call the hook at the top level. Use a local name that starts with "use"
  // so eslint-plugin-react-hooks recognizes it.
  const useHook = useQuery;
  const queryResult = useHook(...(useQueryArgs ?? ([] as unknown as Args)));

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
}

/** Convenience wrappers with no-arg hooks */
export const RecentProducts = (p: StackProps) => <ProductRail {...p} useQuery={useRecentProducts} />;

export const DiscountedProducts = (p: StackProps) => <ProductRail {...p} useQuery={useDiscountedProducts} />;

export const FeaturedProducts = (p: StackProps) => <ProductRail {...p} useQuery={useFeaturedProducts} />;

/** Debug: pass hook + args separately */
export const DebugProducts = (p: StackProps) => (
  <ProductRail
    {...p}
    useQuery={useDebugProducts}
    // If the hook signature is (ids: number[]) => QueryResult<...>,
    // the args tuple type is [number[]], so we wrap the array in another array:
    useQueryArgs={[[27445, 26995]]}
  />
);
