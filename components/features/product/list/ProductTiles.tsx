import { TileBadge } from '@/components/ui/tile/TileBadge';
import { TileFixed } from '@/components/ui/tile/TileFixed';
import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { PurchasableProduct } from '@/types';
import React, { JSX } from 'react';
import { StackProps } from 'tamagui';
import { HorizontalTiles } from '../../../ui/tile/HorizontalTiles';
import { ProductPriceTag } from '../display/ProductPriceTag';

type Props = {
    limit?: number; // NEW: cap items for home rows
} & StackProps;

export const RecentProducts = (props: Props): JSX.Element => {
    return <ProductTiles {...props} queryResult={useRecentProducts()} />
};

export const DiscountedProducts = (props: Props): JSX.Element => {
    return <ProductTiles {...props} queryResult={useDiscountedProducts()} />
};

export const FeaturedProducts = (props: Props): JSX.Element => {
    return <ProductTiles {...props} queryResult={useFeaturedProducts()} />
};

export const DebugProducts = (props: Props): JSX.Element => {
    return <ProductTiles {...props} queryResult={useProductsByIds([246557, 35961, 27445])} />
};


type ProductTilesProps = {
    queryResult: QueryResult<PurchasableProduct>;
    limit?: number; // NEW: cap items for home rows
} & StackProps;

const ProductTiles: React.FC<ProductTilesProps> = ({ queryResult, limit = 4, ...stackProps }) => {

    const { to } = useCanonicalNav();

    return (
        <HorizontalTiles
            queryResult={queryResult}
            limit={limit}
            estimatedItemSize={PRODUCT_TILE_WIDTH as number}
            estimatedItemCrossSize={PRODUCT_TILE_HEIGHT as number}
            gapToken="$3"
            padToken="$3"
            leadingInsetToken="$6"
            h={PRODUCT_TILE_HEIGHT}
            renderItem={({ item: product, index }) => (

                <TileFixed
                    onPress={() => to('product', product)}
                    title={product.name}
                    image={product.featuredImage}
                    w={PRODUCT_TILE_WIDTH as number}
                    h={PRODUCT_TILE_HEIGHT as number}
                    // tiny micro-optic: higher priority for first 3 tiles
                    imagePriority={index < 3 ? 'high' : 'low'}
                >
                    <TileBadge pointerEvents="none">
                        <ProductPriceTag product={product} />
                    </TileBadge>
                </TileFixed>

            )}
            {...stackProps}
        />
    );
};
