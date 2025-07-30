import { Tile } from "@/components/ui/tile/Tile";
import { TileBadge } from "@/components/ui/tile/TileBadge";
import { routes } from '@/config/routes';
import { ProductProvider } from '@/contexts';
import { Product, ThemeVariant } from "@/types";
import { HrefObject } from "expo-router";
import React from 'react';
import { DimensionValue } from 'react-native';
import { PriceTag } from './display/PriceTag';

export const PRODUCT_TILE_WIDTH: DimensionValue = 120;
export const PRODUCT_TILE_HEIGHT: DimensionValue = 90;

interface ProductTileProps {
    product: Product;
    width?: DimensionValue;
    height?: DimensionValue;
    theme?: ThemeVariant;
}

export const ProductTile = ({
    product,
    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    theme = 'primary'
}: ProductTileProps) => {

    if (!product) {
        return null;
    }

    return (
        <Tile
            width={width}
            height={height}
            theme={theme}
            title={product.name + ' ' + product.id}
            imageUrl={product.image?.src ?? ''}
            titleNumberOfLines={1}
            href={routes.product.path(product) as HrefObject}
        >
            <TileBadge theme={theme}>
                <ProductProvider product={product}>
                    <PriceTag />
                </ProductProvider>
            </TileBadge>
        </Tile>
    );
};
