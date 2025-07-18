import { CategoryChips } from '@/components/features/category/CategoryChips';
import { AttributeDisplay } from '@/components/features/product/AttributeDisplay';
import { CustomText } from '@/components/ui';
import { Product } from '@/types';
import React from 'react';

interface ProductDetailsProps {
    product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
    return (
        <>
            <CustomText fontSize="sm">{product.description || 'Ingen beskrivelse tilgjengelig'}</CustomText>
            {product.attributes
                .filter(attr => !attr.variation)
                .map(attribute => (
                    <AttributeDisplay key={attribute.id} attribute={attribute} />
                ))}

            <CategoryChips categories={product.categories} />
        </>
    );
}; 
