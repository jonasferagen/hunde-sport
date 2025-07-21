import { Loader } from '@/components/ui';
import { useProductsList } from '@/hooks/Product';
import { ProductListType } from '@/hooks/Product/api';
import { SPACING } from '@/styles';
import React, { JSX } from 'react';
import { View } from 'react-native';
import { ProductTile } from './ProductTile';

interface ProductTilesProps {
    type: ProductListType;
    themeVariant?: string;
}

export const ProductTiles = ({ type, themeVariant }: ProductTilesProps): JSX.Element => {
    const { products, isLoading } = useProductsList(type);

    if (isLoading) {
        return <Loader size="large" flex />;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return (
        <View style={{ gap: SPACING.md, flexDirection: 'row' }}>
            {products.map((product) => (
                <ProductTile
                    key={product.id}
                    product={product}
                    themeVariant={themeVariant}
                />
            ))}
        </View>
    );
};
