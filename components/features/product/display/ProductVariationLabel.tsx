import { ThemedText, ThemedXStack } from '@/components/ui';
import { usePurchasableContext } from '@/contexts';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface ProductVariationLabelProps extends SizableTextProps { }

export const ProductVariationLabel = ({ ...props }: ProductVariationLabelProps) => {

    const { purchasable } = usePurchasableContext();
    const { productVariation } = purchasable;

    const parsedVariation = productVariation?.getParsedVariation();

    return <ThemedXStack gap="$1">
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
                        variant="subtle"
                    >
                        {attr.name}:
                    </ThemedText>
                    <ThemedText
                        variant="emphasized"
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
