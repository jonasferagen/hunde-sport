import { ThemedText, ThemedXStack } from '@/components/ui';
import { ProductVariation } from '@/types';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface Props extends SizableTextProps {
    productVariation?: ProductVariation;
    currentSelection?: Record<string, string>;
}

export const ProductVariationLabel = ({ productVariation, currentSelection, ...props }: Props) => {
    const pairs = React.useMemo(() => {
        if (currentSelection && Object.keys(currentSelection).length) {
            return Object.entries(currentSelection).map(([name, value]) => ({ name, value }));
        }
        return productVariation?.getParsedVariation() ?? [];
    }, [currentSelection, productVariation]);

    return (
        <ThemedXStack gap="$2">
            {pairs.map((attr) => {
                return (
                    <ThemedXStack key={attr.name} gap="$1">
                        <ThemedText fos="$3" tt="capitalize" height="auto">
                            {attr.name}:
                        </ThemedText>
                        <ThemedText bold fos="$4" tt="capitalize">
                            {attr.value}
                        </ThemedText>
                    </ThemedXStack>
                );
            })}
        </ThemedXStack>
    );
};
