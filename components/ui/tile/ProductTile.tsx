import { Tile } from "@/components/ui/tile/Tile";
import { TileBadge } from "@/components/ui/tile/TileBadge";
import { routes } from '@/config/routes';
import { ProductProvider, useProductContext } from '@/contexts';
import { Product, ThemeVariant } from "@/types";
import React from 'react';
import { DimensionValue } from 'react-native';
import { PriceTag } from '../../features/product/display/PriceTag';

const PRODUCT_TILE_WIDTH: DimensionValue = 200;
const PRODUCT_TILE_HEIGHT: DimensionValue = 100;

interface ProductTileProps {
    product: Product;
    width?: DimensionValue;
    height?: DimensionValue;
    theme?: ThemeVariant;
}

const ProductTileContent = ({
    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    theme = 'primary'
}: Omit<ProductTileProps, 'product'>) => {
    const { product } = useProductContext();

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
            titleNumberOfLines={2}
            gradientMinHeight={40}
            href={routes.product(product)}
        >
            <TileBadge theme={theme}>
                <PriceTag />
            </TileBadge>
        </Tile>
    );
};

export const ProductTile = ({ product, ...props }: ProductTileProps) => {
    return (
        <ProductProvider product={product}>
            <ProductTileContent {...props} />
        </ProductProvider>
    );
};