
import { usePurchasableContext } from '@/contexts';
import React from 'react';
import { SizableText, SizableTextProps, XStack } from 'tamagui';


export const ProductStatus = ({ showInStock = true, ...props }: { showInStock?: boolean } & SizableTextProps) => {

    const { purchasable } = usePurchasableContext();
    const { activeProduct } = purchasable;
    const { isInStock: inStock, isOnBackOrder } = activeProduct.availability;


    const green = 'green'
    const yellow = 'yellow'
    const red = 'red'

    const color = inStock ? green : isOnBackOrder ? yellow : red;
    const text = inStock ? 'På lager' : isOnBackOrder ? 'På vei' : 'Utsolgt';

    return (
        <XStack gap="$1" ai="center" >
            <SizableText fos="$3" fow="bold" {...props}><SizableText col={color}>⬤</SizableText> {text}</SizableText>
        </XStack>
    );

};


