// ProductRail.tsx
import { HorizontalTiles } from '@/components/ui/tile/HorizontalTiles';
import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import type { QueryResult } from '@/hooks/data/util';
import type { PurchasableProduct } from '@/types';
import React from 'react';
import { SpaceTokens, StackProps, Theme } from 'tamagui';

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
    leadingInsetToken = '$3',
    gapToken = '$3',
    padToken = '$3',
    theme,
    ...stackProps
}) => {
    const queryResult = useQuery();

    return (
        <Theme name={theme || null} >
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


// rails (kept for readability; easy to delete later)
import {
    useDiscountedProducts,
    useFeaturedProducts,
    useProductsByIds,
    useRecentProducts,
} from '@/hooks/data/Product';


export const RecentProducts = (p: StackProps) =>
    <ProductRail {...p} useQuery={useRecentProducts} />;

export const DiscountedProducts = (p: StackProps) =>
    <ProductRail {...p} useQuery={useDiscountedProducts} />;

export const FeaturedProducts = (p: StackProps) =>
    <ProductRail {...p} useQuery={useFeaturedProducts} />;

// Debug keeps the API: pass a closure that calls the hook with params
export const DebugProducts = (p: StackProps) =>
    <ProductRail {...p} useQuery={() => useProductsByIds([246557, 35961, 27445])} />;
