// ProductTile.tsx
import { TileBadge } from '@/components/ui/tile/TileBadge';
import { TileFixed } from '@/components/ui/tile/TileFixed';
import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import React from 'react';
import { YStackProps } from 'tamagui';
import { ProductPriceTag } from '../display/ProductPriceTag';

interface ProductTileProps extends YStackProps { }

export const ProductTile = React.memo(function ProductTile({
    ...stackProps
}: ProductTileProps) {
    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const { to } = useCanonicalNav();

    const onPress = React.useCallback(() => {
        to('product', product);
    }, [to, product.id]);

    return (
        <TileFixed
            onPress={onPress}
            title={product.name}
            image={product.featuredImage}
            w={PRODUCT_TILE_WIDTH as number}
            h={PRODUCT_TILE_HEIGHT as number}
        >
            <TileBadge><ProductPriceTag /></TileBadge>
        </TileFixed>
    );
});
