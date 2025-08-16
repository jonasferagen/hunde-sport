import { Tile, TileBadge } from "@/components/ui/tile/Tile";
import React from 'react';
import { Theme, YStackProps } from "tamagui";
import { ProductPriceTag } from '../display/ProductPriceTag';

import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { useCanonicalNav } from "@/hooks/useCanonicalNav";
import { Link } from 'expo-router';

interface ProductTileProps extends YStackProps {
}

export const ProductTile: React.FC<ProductTileProps> = ({
    ...stackProps
}) => {
    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const { linkProps } = useCanonicalNav();
    return (
        <Theme>
            <Link {...linkProps('product', product)} asChild>
                <Tile
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
