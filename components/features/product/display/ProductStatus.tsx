
import { ThemedText, ThemedXStack } from '@/components/ui';
import { Product } from '@/types';
import React from 'react';
import { SizableText, SizableTextProps, XStack } from 'tamagui';

interface Props extends SizableTextProps {
    product: Product;
    showInStock?: boolean;
}

export const ProductStatus = ({ product, showInStock = true, ...props }: Props) => {

    const { isInStock: inStock, isOnBackOrder } = product.availability;


    const green = 'green'
    const yellow = 'yellow'
    const red = 'red'

    const color = inStock ? green : isOnBackOrder ? yellow : red;
    const text = inStock ? 'På lager' : isOnBackOrder ? 'På vei' : 'Utsolgt';

    return showInStock || !inStock ? (
        <XStack gap="$1">
            <ThemedText col={color}>⬤</ThemedText><ThemedText> {text}</ThemedText>
        </XStack>
    ) : null;

};


