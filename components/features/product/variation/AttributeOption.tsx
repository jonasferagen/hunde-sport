import { useProductVariationSelectionContext } from '@/contexts/ProductVariationSelectionContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductAttributeOption as ProductAttributeOptionType } from '@/types';
import { formatPriceRange } from '@/utils/helpers';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, ThemeName, XStack } from 'tamagui';
import { Price } from '../display/Price';
import { ProductStatus } from '../display/ProductStatus';

interface AttributeOptionProps {
    item: ProductAttributeOptionType;
    attribute: ProductAttribute;
}

const getThemeName = (name: string): ThemeName => name as ThemeName;

export const AttributeOption = ({ item: option, attribute }: AttributeOptionProps) => {
    const { selectOption, getOptionState } = useProductVariationSelectionContext();

    const { isSelected, isAvailable, isOutOfStock, matchingVariation, priceRange, isFinalOption } = getOptionState(
        attribute.id,
        option.name!
    );
    const isDisabled = !isAvailable || isOutOfStock;

    return (
        <Pressable
            onPress={() => !isDisabled && selectOption(attribute.id, option.name!)}
            style={{
                flex: 1,
            }}
        >
            <XStack
                flex={1}
                p="$3"
                gap="$3"
                borderWidth={2}
                borderRadius="$4"
                borderColor={isSelected ? '$blue10' : '$borderColor'}
                theme={getThemeName(option.name!)}
                backgroundColor={isSelected ? '$backgroundFocus' : '$background'}
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                opacity={isDisabled ? 0.5 : 1}
                jc='space-between'
            >
                <XStack gap="$2">
                    <SizableText
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textDecorationLine={isDisabled ? 'line-through' : 'none'}
                        color={'$color'}
                    >
                        {option.label}
                    </SizableText>
                    {isFinalOption && matchingVariation && <ProductStatus productOverride={matchingVariation} fontSize="$1" />}
                </XStack>
                <XStack ai='flex-start' jc="space-between" gap="$2">
                    {matchingVariation && isFinalOption ? (
                        <>
                            <XStack ai='flex-start' jc="center" gap="$3">
                                <Price fontSize="$5" activeProduct={matchingVariation} />
                            </XStack>
                        </>
                    ) : priceRange && (
                        <SizableText fontSize="$5">{formatPriceRange(priceRange)}</SizableText>
                    )}
                </XStack>
            </XStack>
        </Pressable>
    );
};