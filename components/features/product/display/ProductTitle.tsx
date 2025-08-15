import { usePurchasableContext } from '@/contexts';
import React from 'react';
import { Heading, SizableTextProps } from 'tamagui';

interface ProductTitleProps extends SizableTextProps { }

export const ProductTitle = ({ children, ...props }: ProductTitleProps) => {

    const { purchasable } = usePurchasableContext();
    const { activeProduct } = purchasable;
    return <Heading
        fontWeight="bold"
        {...props}
    >
        {activeProduct.name}
        {children}
    </Heading>;
};


