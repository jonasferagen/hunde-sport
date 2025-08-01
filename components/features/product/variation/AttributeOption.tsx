import { ProductAttribute } from '@/models/ProductAttribute';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, XStack } from 'tamagui';

interface AttributeOptionProps {
    option: string;
    attribute: ProductAttribute;
    selectOption: () => void;
    isSelected: boolean;
    isAvailable: boolean;
    price: string,
    inStock: boolean
}

export const AttributeOption = ({ option, attribute, price, selectOption, isSelected, isAvailable, inStock }: AttributeOptionProps) => {

    const stockStatus = inStock ? null : <SizableText fontSize="$2" fontWeight="bold" color={'red'}>⬤ Utsolgt</SizableText>
    const disabled = !isAvailable || !inStock;

    return (
        <Pressable
            onPress={() => selectOption()}
            style={{
                flex: 1,
            }}
            disabled={disabled}

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
                opacity={disabled ? 0.7 : 1}
                ai="center"
                jc="space-between"
            >
                <SizableText fontWeight={isSelected ? 'bold' : 'normal'} color={'$color'}>
                    {option}
                </SizableText>
                {stockStatus}
                <SizableText fontWeight={isSelected ? 'bold' : 'normal'} color={'$color'}>
                    {price}
                </SizableText>
            </XStack>
        </Pressable>
    );
};
