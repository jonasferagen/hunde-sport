import { Tile, TileBadge } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import React from 'react';
import { Theme, YStackProps } from "tamagui";
import { ProductPriceTag } from './display/ProductPriceTag';

import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { THEME_MAIN } from "@/tamagui/app";
import { Link } from 'expo-router';
import { DimensionValue } from "react-native";

interface ProductTileProps extends YStackProps {
    width?: DimensionValue;
    height?: DimensionValue;
}

export const ProductTile: React.FC<ProductTileProps> = ({

    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    ...stackProps
}) => {
    const { purchasable } = usePurchasableContext();
    const product = purchasable.product;
    return (
        <Theme inverse name={THEME_MAIN}>
            <Link href={routes['product'].path(product)} asChild>
                <Tile
                    w={width}
                    h={height}
                    title={product.name}
                    image={product.featuredImage}
                    {...stackProps}
                >

                    <TileBadge >
                        <ProductPriceTag />
                    </TileBadge>

                </Tile>
            </Link>
        </Theme>

    );
};
