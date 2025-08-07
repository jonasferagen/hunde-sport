import { Tile } from "@/components/ui/tile/Tile";
import { TileBadge } from "@/components/ui/tile/TileBadge";
import { routes } from '@/config/routes';
import { ProductProvider } from '@/contexts';
import React from 'react';
import { ThemeName, YStack, YStackProps } from "tamagui";
import { PriceTag } from './display/PriceTag';

import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { PurchasableProduct } from '@/models/Product/Product';
import { Link } from 'expo-router';

interface ProductTileProps extends YStackProps {
    product: PurchasableProduct
    width?: number;
    height?: number;
}

export const ProductTile: React.FC<ProductTileProps> = ({
    product,
    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    ...stackProps
}) => {
    return (
        <Link href={routes['product'].path(product)} asChild>
            <Tile
                w={width}
                h={height}
                title={product.name}
                image={product.featuredImage}
                titleNumberOfLines={1}
                {...stackProps}
            >
                <ProductProvider product={product}>
                    <YStack>
                        <TileBadge theme={stackProps.theme as ThemeName} >
                            <PriceTag />
                        </TileBadge>
                    </YStack>
                </ProductProvider>
            </Tile>
        </Link>
    );
};
