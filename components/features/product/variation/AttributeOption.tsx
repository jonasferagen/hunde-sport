import { useProductVariationSelectionContext } from '@/contexts/ProductVariationSelectionContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductAttributeOption as ProductAttributeOptionType } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, ThemeName, XStack } from 'tamagui';

interface AttributeOptionProps {
    item: ProductAttributeOptionType;
    attribute: ProductAttribute;
}

const getThemeName = (name: string): ThemeName => name as ThemeName;

export const AttributeOption = ({ item: option, attribute }: AttributeOptionProps) => {
    const { selectOption, getOptionState } = useProductVariationSelectionContext();

    const { isSelected, isAvailable, isOutOfStock, matchingVariation } = getOptionState(attribute.id, option.name!);
    const isDisabled = !isAvailable || isOutOfStock;

    const price = matchingVariation ? formatPrice(matchingVariation.price) : null;

    return (
        <Pressable
            onPress={() => !isDisabled && selectOption(attribute.id, option.name!)}
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
                        {price}
                    </SizableText>
                </XStack>
            </XStack>
        </Pressable>
    );
};
