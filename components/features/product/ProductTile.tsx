import { Tile, TileBadge } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { ProductProvider } from '@/contexts';
import React from 'react';
import { ThemeName, YStackProps } from "tamagui";
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
                {...stackProps}
            >
                <ProductProvider product={product}>
                    <TileBadge theme={stackProps.theme as ThemeName} >
                        <PriceTag />
                    </TileBadge>
                </ProductProvider>
            </Tile>
        </Link>
    );
};
