import { useProductContext } from '@/contexts/ProductContext';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductAttributeOption as ProductAttributeOptionType } from '@/types';
import { formatPriceRange } from '@/utils/helpers';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, ThemeName, XStack } from 'tamagui';
import { VariantInfo } from '../display/VariantInfo';

interface AttributeOptionProps {
    item: ProductAttributeOptionType;
    attribute: ProductAttribute;
}

const getThemeName = (name: string): ThemeName => name as ThemeName;

export const AttributeOption = ({ item: option, attribute }: AttributeOptionProps) => {
    const { handleOptionSelect, selectedOptions, availableOptions } = useProductContext();

    const matchingVariants = availableOptions.get(attribute.id)?.get(option.name!)
    const singleVariant = matchingVariants && matchingVariants.length === 1 ? matchingVariants[0] : null;
    const isOutOfStock = singleVariant ? singleVariant.stock_status === 'outofstock' : false;
    const isDisabled = !matchingVariants || matchingVariants.length === 0 || isOutOfStock;
    const isSelected = selectedOptions[attribute.id] === option.name;
    const priceRange = calculatePriceRange(matchingVariants);

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
                justifyContent='space-between'
                alignItems='center'
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
                <XStack alignItems='flex-end'>
                    <SizableText color={'$color'}>
                        {matchingVariants && matchingVariants.length === 1 ? (
                            <VariantInfo variant={matchingVariants[0]} />
                        ) : matchingVariants && matchingVariants.length > 1 ? (
                            formatPriceRange(priceRange!)
                        ) : null}
                    </SizableText>
                </XStack>
            </XStack>
        </Pressable>
    );
};

// Helper function to calculate price range, can be moved to a utility file if needed
const calculatePriceRange = (variants: Product[] | undefined) => {
    if (!variants || variants.length === 0) {
        return null;
    }

    const prices = variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return { min: minPrice, max: maxPrice };
};
