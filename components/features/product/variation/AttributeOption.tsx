import { calculatePriceRange } from '@/contexts/ProductContext';
import { useProductVariationContext } from '@/contexts/ProductVariationContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductAttributeOption as ProductAttributeOptionType } from '@/types';
import { formatPrice, formatPriceRange } from '@/utils/helpers';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, ThemeName, XStack } from 'tamagui';

interface AttributeOptionProps {
    item: ProductAttributeOptionType;
    attribute: ProductAttribute;
}

const getThemeName = (name: string): ThemeName => name as ThemeName;

export const AttributeOption = ({ item: option, attribute }: AttributeOptionProps) => {
    const { handleOptionSelect, selectedOptions, availableOptions, } = useProductVariationContext();

    const matchingVariants = availableOptions.get(attribute.id)?.get(option.name!)
    const singleVariant = matchingVariants && matchingVariants.length === 1 ? matchingVariants[0] : null;
    const isOutOfStock = singleVariant ? singleVariant.stock_status === 'outofstock' : false;
    const isDisabled = !matchingVariants || matchingVariants.length === 0 || isOutOfStock;
    const isSelected = selectedOptions[attribute.id] === option.name;
    const priceRange = calculatePriceRange(matchingVariants || []);

    return (
        <Pressable
            onPress={() => !isDisabled && handleOptionSelect(attribute.id, option.name!)}
            disabled={isDisabled}
        >
            <XStack
                flex={1}
                theme={isSelected ? getThemeName('primary') : null}
                backgroundColor={isSelected ? '$background' : 'transparent'}
                paddingVertical={"$3"}
                paddingHorizontal={"$2"}
                jc='space-between'
                ai='center'
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                opacity={isDisabled ? 0.5 : 1}
            >
                <XStack gap={"$2"}>
                    <SizableText
                        textTransform="capitalize"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textDecorationLine={isDisabled ? 'line-through' : 'none'}
                        color={'$color'}
                    >
                        {option.label}
                    </SizableText>
                </XStack>
                <XStack ai='flex-end'>
                    <SizableText color={'$color'}>
                        {matchingVariants && matchingVariants.length === 1 ? (
                            formatPrice(matchingVariants[0].price)
                        ) : matchingVariants && matchingVariants.length > 1 ? (
                            formatPriceRange(priceRange!)
                        ) : null}
                    </SizableText>
                </XStack>
            </XStack>
        </Pressable>
    );
};
