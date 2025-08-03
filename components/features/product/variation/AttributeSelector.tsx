import { ProductAttribute, ProductAttributeTerm } from '@/models/Product/ProductAttribute';
import { ProductVariation } from '@/models/Product/ProductVariation';
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



/**
 * Calculates the availability, price, and stock status for a single attribute option.
 */
const getOptionDetails = (
    term: ProductAttributeTerm,
    attributeName: string,
    compatibleVariations: ProductVariation[]
) => {
    const potentialMatches = compatibleVariations.filter((variation) =>
        variation.hasAttribute(attributeName, term.slug)
    );

    const isAvailable = potentialMatches.length > 0;
    let displayPrice = '';
    let inStock = true;

    if (isAvailable) {
        const prices = potentialMatches.map((v) => Number(v.prices.price));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        displayPrice =
            minPrice === maxPrice
                ? formatPrice(minPrice.toString())
                : `Fra ${formatPrice(minPrice.toString())}`;

        inStock = potentialMatches.some((v) => v.is_in_stock);
    }

    return { isAvailable, displayPrice, inStock };
};

export const AttributeSelector = ({
    attribute,
    productVariations,
    onSelectOption,
    selectedOptions,
}: AttributeSelectorProps) => {
    // Find variations compatible with *other* selected attributes.
    const otherSelectedOptions = { ...selectedOptions };
    delete otherSelectedOptions[attribute.name];

    const compatibleVariations = productVariations.filter((variation) =>
        variation.matchesAttributes(otherSelectedOptions)
    );

    const renderItem = ({ item }: { item: string }) => {
        const term = attribute.terms.find((t) => t.name === item);
        if (!term) {
            console.error(`Term ${item} not found for attribute ${attribute.name}`);
            return null; // Should not happen
        }

        const isSelected = selectedOptions[attribute.name] === term.slug;

        const { isAvailable, displayPrice, inStock } = getOptionDetails(
            term,
            attribute.name,
            compatibleVariations
        );

        return (
            <AttributeOption
                option={item}
                attribute={attribute}
                selectOption={() => onSelectOption(item)}
                isSelected={isSelected}
                isAvailable={isAvailable}
                price={displayPrice}
                inStock={inStock}
            />
        );
    };

    const ITEM_HEIGHT = 60; // Approximate item height
    return (
        <YStack>
            <FlashList
                data={attribute.terms.map((t) => t.name)}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item}-${attribute.id}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={selectedOptions}
                ItemSeparatorComponent={() => <YStack h="$2" />}
            />
        </YStack>
    );
};