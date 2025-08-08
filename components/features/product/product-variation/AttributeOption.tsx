import { formatPrice } from '@/lib/helpers';
import { AttributeTermDetails } from '@/types';
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

    const { isAvailable, isPurchasable, inStock, maxPrices, minPrices } = item;

    const disabled = !isAvailable || !isPurchasable;
    const minPrice = minPrices?.price ?? null;
    const maxPrice = maxPrices?.price ?? null;


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
            gap="$1"
            br="$3"
            boc="$borderColor"
            bg="$background"
            opacity={disabled ? 0.5 : 1}
        >
            {isAvailable && <SizableText fontSize="$1" fontWeight="bold" color={inStock ? "green" : "red"}>⬤</SizableText>}
            <SizableText f={1} fow={isSelected ? "bold" : "normal"} col="$color" tt="capitalize" textDecorationLine={disabled ? "line-through" : "none"}>
                {option}
            </SizableText>
            <SizableText f={0} fow={isSelected ? "bold" : "normal"} col="$color" textDecorationLine={!inStock ? "line-through" : "none"}>
                {minPrice ? minPrice === maxPrice ? formatPrice(minPrice) : `Fra ${formatPrice(minPrice)}` : null}
            </SizableText>

        </XStack>

    </Pressable>

};

