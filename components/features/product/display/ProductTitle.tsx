import { useProductContext } from '@/contexts';
import React from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

export const ProductTitle = ({ size = "$3", ...props }: SizableTextProps) => {
    const { purchasable } = useProductContext();
    const { full_title } = purchasable;

    return <SizableText
        fos={size}
        fow="bold"
        fs={1}
        {...props}
    >
        {full_title}
    </SizableText>;
};