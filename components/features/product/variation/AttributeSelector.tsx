import { ProductVariation } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { YStack } from 'tamagui';
import { AttributeOption } from './AttributeOption';

interface AttributeSelectorProps {
    attribute: ProductAttribute;
    productVariations: ProductVariation[];
    onSelectOption: (optionLabel: string) => void;
    selectedOptions: { [key: string]: string };
}

const ITEM_HEIGHT = 60; // Approximate item height

export const AttributeSelector = ({
    attribute,
    productVariations,
    onSelectOption,
    selectedOptions,
}: AttributeSelectorProps) => {
    const renderItem = ({ item }: { item: string }) => {
        const selectedOption = selectedOptions[attribute.name] ?? undefined;

        const term = attribute.terms.find((t) => t.name === item);
        const isSelected = !!(term && selectedOption === term.slug);

        const isAvailable = productVariations.some((variation) => {
            return variation.variation_attributes?.some(
                (attr: any) => attr.name === attribute.name && attr.value === term?.slug
            );
        });

        return (
            <AttributeOption
                option={item}
                attribute={attribute}
                selectOption={() => onSelectOption(item)}
                isSelected={isSelected}
                isAvailable={isAvailable}
            />
        );
    };

    return (
        <YStack>
            <FlashList
                data={attribute.terms.map((t) => t.name)}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item}-${attribute.id}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={selectedOptions}
            />
        </YStack>
    );
};