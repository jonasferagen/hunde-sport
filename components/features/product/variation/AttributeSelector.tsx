import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductAttributeOption as ProductAttributeOptionType } from '@/types';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { YStack } from 'tamagui';
import { AttributeOption } from './AttributeOption';

interface AttributeSelectorProps {
    attribute: ProductAttribute;
    options: ProductAttribute['options'];
}

const ITEM_HEIGHT = 60; // Approximate item height

export const AttributeSelector = ({ attribute, options }: AttributeSelectorProps) => {
    const renderItem = ({ item }: { item: ProductAttributeOptionType }) => (
        <AttributeOption item={item} attribute={attribute} />
    );

    return (
        <YStack flex={1}>
            <FlashList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.name}-${attribute.id}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={attribute} // Ensures re-render when attribute changes
            />
        </YStack>
    );
};
