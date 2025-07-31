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
}

export const AttributeOption = ({ option, attribute, selectOption, isSelected, isAvailable }: AttributeOptionProps) => {
    return (
        <Pressable
            onPress={() => selectOption()}
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
                opacity={isAvailable ? 1 : 0.5}
            >
                <SizableText fontWeight={isSelected ? 'bold' : 'normal'} color={'$color'}>
                    {option}
                </SizableText>
            </XStack>
        </Pressable>
    );
};
