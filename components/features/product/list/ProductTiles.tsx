import { TileBadge } from '@/components/ui/tile/TileBadge';
import { TileFixed } from '@/components/ui/tile/TileFixed';
import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { PurchasableProviderInit } from '@/contexts/PurchasableContext';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { PurchasableProduct } from '@/types';
import React, { JSX } from 'react';
import { Dimensions } from 'react-native';
import { StackProps } from 'tamagui';
import { HorizontalTiles } from '../../../ui/tile/HorizontalTiles';
import { ProductPriceTag } from '../display/ProductPriceTag';
import { ProductTile } from './ProductTile';

export const RecentProducts = (props: StackProps): JSX.Element => {
    return <ProductTiles queryResult={useRecentProducts()} {...props} />
};

export const DiscountedProducts = (props: StackProps): JSX.Element => {
    return <ProductTiles queryResult={useDiscountedProducts()} {...props} />
};

export const FeaturedProducts = (props: StackProps): JSX.Element => {
    return <ProductTiles queryResult={useFeaturedProducts()} {...props} />
};

export const DebugProducts = (props: StackProps): JSX.Element => {
    return <ProductTiles queryResult={useProductsByIds([246557, 35961, 27445])} {...props} />
};



interface ProductTilesProps extends StackProps {
    queryResult: QueryResult<PurchasableProduct>;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const ProductTiles: React.FC<ProductTilesProps> = ({ queryResult, ...stackProps }) => {
    const { to } = useCanonicalNav();

    return (
        <HorizontalTiles
            {...queryResult}
            {...stackProps}
            // make sure HorizontalTiles passes these to FlashList:
            estimatedItemSize={PRODUCT_TILE_WIDTH as number} // width is the primary axis for horizontal
            renderItem={({ item: product }) => {
                return (
                    <PurchasableProviderInit product={product}>
                        <ProductTile w={PRODUCT_TILE_WIDTH} h={PRODUCT_TILE_HEIGHT} >
                            <TileFixed
                                onPress={() => to('product', product)}
                                title={product.name}
                                image={product.featuredImage}
                                w={PRODUCT_TILE_WIDTH as number}
                                h={PRODUCT_TILE_HEIGHT as number}
                            >
                                <TileBadge><ProductPriceTag /></TileBadge>
                            </TileFixed>
                        </ProductTile>
                    </PurchasableProviderInit>
                );
            }}
        />
    );
};