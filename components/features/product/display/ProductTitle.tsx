import { useProductContext } from '@/contexts';
import React from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

export const ProductTitle = ({ size = "$3", ...props }: SizableTextProps) => {
    const { product, productVariation } = useProductContext();

    if (!product) {
        return null;
    }

    let title = product.name;

    if (productVariation?.variation_attributes) {
        const attributeNames = productVariation.variation_attributes
            .map((variationAttr) => {
                const parentAttribute = product.attributes.find((attr) => attr.name === variationAttr.name);
                if (parentAttribute) {
                    const term = parentAttribute.terms.find((t) => t.slug === variationAttr.value);
                    return term ? term.name : null;
                }
                return null;
            })
            .filter(Boolean);

        if (attributeNames.length > 0) {
            title = `${product.name}, ${attributeNames.join(' ')}`;
        }
    }

    return <SizableText fontSize={size} fontWeight="bold" flexShrink={1} {...props}>{title}</SizableText>;
};