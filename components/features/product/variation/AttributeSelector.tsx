import { ProductVariation } from '@/models/Product/Product';
import { ProductAttribute } from '@/models/Product/ProductAttribute';
import { formatPrice } from '@/utils/helpers';
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

        console.log(productVariations.length);

        // To determine if an option is available, we first find all variations that match the *other* selected attributes.
        const otherSelectedOptions = { ...selectedOptions };
        delete otherSelectedOptions[attribute.name];

        const compatibleVariations = productVariations.filter((variation) =>
            variation.matchesAttributes(otherSelectedOptions)
        );

        // Then, within that compatible set, we check if any variation contains the current option.
        const isAvailable = compatibleVariations.some((variation) =>
            variation.variation_attributes.some(
                (attr) => attr.name === attribute.name && attr.value === term?.slug
            )
        );

        let displayPrice = '';
        let inStock = true;

        if (term && isAvailable) {
            // The potential matches are the same as the compatible variations that also have the current option.
            const potentialMatches = compatibleVariations.filter((variation) =>
                variation.variation_attributes.some(
                    (attr) => attr.name === attribute.name && attr.value === term.slug
                )
            );

            const minPrice = Math.min(...potentialMatches.map((v) => Number(v.prices.price)));
            const maxPrice = Math.max(...potentialMatches.map((v) => Number(v.prices.price)));
            displayPrice = minPrice === maxPrice ? formatPrice(minPrice.toString()) : `Fra ${formatPrice(minPrice.toString())}`;

            if (!potentialMatches.some((v) => v.is_in_stock)) {
                inStock = false;
            }
        }

        return <AttributeOption
            option={item}
            attribute={attribute}
            selectOption={() => onSelectOption(item)}
            isSelected={isSelected}
            isAvailable={isAvailable}
            price={displayPrice}
            inStock={inStock}
        />
    };

    return <YStack>
        <FlashList
            data={attribute.terms.map((t) => t.name)}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item}-${attribute.id}-${index}`}
            estimatedItemSize={ITEM_HEIGHT}
            extraData={selectedOptions}
        />
    </YStack>
};