import { TileBadge } from '@/components/ui/tile/TileBadge';
import { TileFixed } from '@/components/ui/tile/TileFixed';
import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { PurchasableProviderInit } from '@/contexts/PurchasableContext';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { PurchasableProduct } from '@/types';
import React, { JSX } from 'react';
import { StackProps } from 'tamagui';
import { HorizontalTiles } from '../../../ui/tile/HorizontalTiles';
import { ProductPriceTag } from '../display/ProductPriceTag';

export const RecentProducts = (props: ProductTilesProps): JSX.Element => {
    return <ProductTiles {...props} queryResult={useRecentProducts()} />
};

export const DiscountedProducts = (props: ProductTilesProps): JSX.Element => {
    return <ProductTiles {...props} queryResult={useDiscountedProducts()} />
};

export const FeaturedProducts = (props: ProductTilesProps): JSX.Element => {
    return <ProductTiles {...props} queryResult={useFeaturedProducts()} />
};

export const DebugProducts = (props: ProductTilesProps): JSX.Element => {
    return <ProductTiles {...props} queryResult={useProductsByIds([246557, 35961, 27445])} />
};


type ProductTilesProps = {
    queryResult: QueryResult<PurchasableProduct>;
    limit?: number; // NEW: cap items for home rows
} & StackProps;

const ProductTiles: React.FC<ProductTilesProps> = ({ queryResult, limit = 8, ...stackProps }) => {
    const items = (queryResult.items ?? []).slice(0, limit);
    const { to } = useCanonicalNav();
    return (
        <HorizontalTiles
            items={items}
            estimatedItemSize={PRODUCT_TILE_WIDTH as number}
            estimatedItemCrossSize={PRODUCT_TILE_HEIGHT as number}
            gapToken="$3"
            padToken="$3"
            leadingInsetToken="$6"
            renderItem={({ item: product, index }) => (
                <PurchasableProviderInit product={product}>
                    <TileFixed
                        onPress={() => to('product', product)}
                        title={product.name}
                        image={product.featuredImage}
                        w={PRODUCT_TILE_WIDTH as number}
                        h={PRODUCT_TILE_HEIGHT as number}
                        // tiny micro-optic: higher priority for first 3 tiles
                        imagePriority={index < 3 ? 'high' : 'low'}
                    >
                        <TileBadge pointerEvents="none"><ProductPriceTag /></TileBadge>
                    </TileFixed>
                </PurchasableProviderInit>
            )}
            {...stackProps}
        />
    );
};
