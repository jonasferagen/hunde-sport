import { CategoryChips } from '@/components/features/category/CategoryChips';
import { AttributeDisplay } from '@/components/features/product/AttributeDisplay';
import { CustomText } from '@/components/ui';
import { Product } from '@/types';
import React from 'react';
import { View } from 'react-native';

interface ProductDetailsProps {
    product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
    return (
        <View>
            <CustomText size="sm">{product.description}</CustomText>
            {product.attributes
                .filter(attr => !attr.variation)
                .map(attribute => (
                    <AttributeDisplay key={attribute.id} attribute={attribute} />
                ))}
            <CategoryChips categories={product.categories} />
        </View>
    );
}; 
