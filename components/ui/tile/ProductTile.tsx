import { Tile } from "@/components/ui/tile/Tile";
import { TileBadge } from "@/components/ui/tile/TileBadge";
import { routes } from '@/config/routes';
import { ProductProvider, useProductContext } from '@/contexts';
import { CARD_DIMENSIONS } from '@/styles';
import { Product, ThemeVariant } from "@/types";
import React from 'react';
import { DimensionValue } from 'react-native';
import { PriceTag } from '../../features/product/display/PriceTag';

interface ProductTileProps {
    product: Product;
    width?: DimensionValue;
    height?: DimensionValue;
    themeVariant?: ThemeVariant;
}

const ProductTileContent = ({
    width = CARD_DIMENSIONS.product.width,
    height = CARD_DIMENSIONS.product.height,
    themeVariant = 'primary'
}: Omit<ProductTileProps, 'product'>) => {
    const { product } = useProductContext();

    if (!product) {
        return null;
    }

    return (
        <Tile
            width={width}
            height={height}
            themeVariant={themeVariant}
            title={product.name + ' ' + product.id}
            imageUrl={product.image?.src ?? ''}
            titleNumberOfLines={2}
            gradientMinHeight={40}
            href={routes.product(product)}
        >
            <TileBadge themeVariant={themeVariant}>
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