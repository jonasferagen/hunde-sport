import { ThemedText, ThemedXStack } from '@/components/ui';
import { ProductVariation } from '@/types';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface Props extends SizableTextProps {
    productVariation?: ProductVariation;
}

export const ProductVariationLabel = ({ productVariation, ...props }: Props) => {

    const parsedVariation = productVariation?.getParsedVariation();

    return <ThemedXStack gap="$2">
        {
            parsedVariation?.map((attr) => {
                return <ThemedXStack
                    key={attr.name}
                    gap="$1"
                >
                    <ThemedText
                        fos="$3"
                        tt="capitalize"
                        height="auto"
                    >
                        {attr.name}:
                    </ThemedText>
                    <ThemedText
                        bold
                        fos="$4"
                        tt="capitalize"
                    >
                        {attr.value}
                    </ThemedText>
                </ThemedXStack>
            })
        }

    </ThemedXStack>;
};
