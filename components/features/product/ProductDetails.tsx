import { CustomText } from '@/components/ui';
import { Product } from '@/models/Product';
import React from 'react';

interface ProductDetailsProps {
    product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
    return (
        <>
            <CustomText fontSize="sm">{product.description || 'Ingen beskrivelse tilgjengelig'}</CustomText>
        </>
    );
};
