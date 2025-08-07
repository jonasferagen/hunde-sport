import { AttributeTermDetails } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, XStack } from 'tamagui';

interface AttributeOptionProps {
    option: string;
    selectOption: () => void;
    isSelected: boolean;
    item: AttributeTermDetails;
}

export const AttributeOption = ({ option, selectOption, isSelected, item }: AttributeOptionProps) => {

    const { isPurchasable, inStock, displayPrice } = item;

    const stockStatus = inStock ? null : <SizableText fontSize="$2" fontWeight="bold" color={'red'}>⬤ Utsolgt</SizableText>
    const disabled = !isPurchasable || !inStock;

    return <Pressable
        onPress={() => selectOption()}
        disabled={disabled}
    >
        <XStack
            f={1}
            width="100%"
            theme={isSelected ? "secondary" : "secondary_elevated"}
            ai="center"
            jc="space-between"
            p="$3"
            bw={2}
            br="$3"
            boc="$borderColor"
            bg="$background"
            opacity={disabled ? 0.7 : 1}
        >
            <SizableText f={1} fow={isSelected ? "bold" : "normal"} col="$color" tt="capitalize" >
                {option}
            </SizableText>
            {stockStatus}
            <SizableText f={0} fow={isSelected ? "bold" : "normal"} col="$color">
                {formatPrice(displayPrice)}
            </SizableText>
        </XStack>

    </Pressable>

};
