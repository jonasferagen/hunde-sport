import { formatPrice } from '@/lib/helpers';
import { AttributeTermDetails } from '@/types';
import React from 'react';
import { Pressable } from 'react-native';
import { Button, SizableText, XStack } from 'tamagui';

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
            w="100%"
            zIndex={10}
            theme={isSelected ? "secondary" : "secondary_elevated"}
            jc="space-between"
            p="$5"
            bw={2}
            gap="$1"
            br="$3"
            boc="$borderColor"
            bg="$background"

        >
            <Button color="black">BBBBB</Button>
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

