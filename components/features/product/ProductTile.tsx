import { Tile } from "@/components/ui/tile/Tile";
import { TileBadge } from "@/components/ui/tile/TileBadge";
import { routes } from '@/config/routes';
import { ProductProvider } from '@/contexts';
import { Product } from "@/types";
import React from 'react';
import { DimensionValue } from 'react-native';
import { ThemeName, YStackProps } from "tamagui";
import { PriceTag } from './display/PriceTag';

export const PRODUCT_TILE_WIDTH: DimensionValue = 120;
export const PRODUCT_TILE_HEIGHT: DimensionValue = 100;

interface ProductTileProps extends YStackProps {
    product: Product;
}

export const ProductTile: React.FC<ProductTileProps> = ({
    product,
    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    ...stackProps
}) => {

    if (!product) {
        return null;
    }

    return (
        <Tile
            w={width}
            h={height}
            title={product.name + ' ' + product.id}
            imageUrl={product.image?.src ?? ''}
            titleNumberOfLines={1}
            href={routes.product.path(product)}
            {...stackProps}
        >
            <TileBadge theme={stackProps.theme as ThemeName}>
                <ProductProvider product={product}>
                    <PriceTag />
                </ProductProvider>
            </TileBadge>
        </Tile>
    );
};
