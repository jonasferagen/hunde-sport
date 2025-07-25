import { useProductContext } from '@/contexts/ProductContext';
import React, { JSX } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element | null => {
    const {
        productVariationAttributes: variationAttributes,
    } = useProductContext();

    if (!variationAttributes || variationAttributes.length === 0) {
        return null;
    }

    return (
        <XStack gap="$2" flexWrap="wrap">
            {variationAttributes.map((attribute) => {
                const options = attribute.options.filter((o) => o.name);

                return (
                    <YStack key={attribute.id} flex={1}>
                        <SizableText fontSize="$3" fontWeight="bold" textTransform="capitalize" mb="$2" ml="$1">
                            {attribute.name}
                        </SizableText>
                        <AttributeSelector
                            attribute={attribute}
                            options={options}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};
