import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/Product/ProductAttribute';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { YStack } from 'tamagui';
import { AttributeOption } from './AttributeOption';

interface AttributeSelectorProps {
    attribute: ProductAttribute;
    onSelect: (value: string) => void;
    selectedValue: string;
}

export const AttributeSelector = ({ attribute, onSelect, selectedValue }: AttributeSelectorProps) => {
    const { product } = useProductContext();

    const options = (product as VariableProduct).getAttributeOptions(attribute.name, { [attribute.name]: selectedValue });

    const renderItem = ({ item }: { item: any }) => {
        const isSelected = selectedValue === item.slug;

        return (
            <AttributeOption
                attribute={attribute}
                option={item.name}
                selectOption={() => onSelect(item.slug)}
                isSelected={isSelected}
                isAvailable={item.isAvailable}
                price={item.displayPrice}
                inStock={item.inStock}
            />
        );
    };

    const ITEM_HEIGHT = 60; // Approximate item height
    return (
        <YStack>
            <FlashList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.slug}-${attribute.id}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={selectedValue}
                ItemSeparatorComponent={() => <YStack h="$2" />}
            />
        </YStack>
    );
};