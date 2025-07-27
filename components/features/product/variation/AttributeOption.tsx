import { useProductVariationSelectionContext } from '@/contexts/ProductVariationSelectionContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductAttributeOption as ProductAttributeOptionType } from '@/types';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, XStack } from 'tamagui';
import { Price } from '../display/Price';
import { PriceRange } from '../display/PriceRange';
import { ProductStatus } from '../display/ProductStatus';

interface AttributeOptionProps {
    item: ProductAttributeOptionType;
    attribute: ProductAttribute;
}

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
                theme={isSelected ? 'primary' : 'secondary'}
                flex={1}
                p="$3"
                gap="$3"
                borderWidth={2}
                borderRadius="$4"
                borderColor={isSelected ? '$borderColor' : 'transparent'}
                backgroundColor={isSelected ? '$background' : 'white'}
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                opacity={isDisabled ? 0.5 : 1}
                jc='space-between'
            >
                <XStack gap="$2">
                    <SizableText
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textDecorationLine={!isAvailable ? 'line-through' : 'none'}
                        color={'$color'}
                    >
                        {option.label}
                    </SizableText>
                    {isFinalOption && matchingVariation && <ProductStatus productOverride={matchingVariation} showInStock={false} fontSize="$1" />}
                </XStack>
                <XStack ai='flex-start' jc="space-between" gap="$2">
                    {matchingVariation && isFinalOption ? (
                        <>
                            <XStack ai='flex-start' jc="center" gap="$3">
                                <Price fontSize="$5" productOverride={matchingVariation} />
                            </XStack>
                        </>
                    ) : priceRange && (
                        <PriceRange fontSize="$4" productPriceRangeOverride={priceRange} />
                    )}
                </XStack>
            </XStack>
        </Pressable>
    );
};