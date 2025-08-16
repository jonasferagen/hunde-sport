import { THEME_OPTION, THEME_OPTION_SELECTED } from '@/config/app';
import { formatMinorWithHeader } from '@/domain/pricing';
import { AttributeTermDetails } from '@/types';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, Theme, XStack } from 'tamagui';

interface AttributeOptionProps {
    option: string;
    selectOption: () => void;
    isSelected: boolean;
    item: AttributeTermDetails;
}

export const AttributeOption = ({
    option,
    selectOption,
    isSelected,
    item
}: AttributeOptionProps) => {
    const { isAvailable, isPurchasable, inStock, maxPrices, minPrices } = item;

    const disabled = !isAvailable || !isPurchasable;
    const minPrice = minPrices?.price ?? null;
    const maxPrice = maxPrices?.price ?? null;


    return (
        <Theme name={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}>
            <Pressable onPress={selectOption} disabled={disabled}>
                <XStack
                    f={1}
                    w="100%"
                    miw={0} // ✅ ensures child flex items can shrink instead of disappearing
                    fw="nowrap"
                    ai="center"
                    jc="space-between"
                    p="$3"
                    bw={2}
                    gap="$1"
                    br="$3"
                    boc="$borderColor"
                    bg="$background"
                    zIndex={10}
                >
                    {isAvailable && (
                        <SizableText
                            fs={0} // ✅ don’t let the circle disappear
                            fos="$2"
                            fow="bold"
                            color={inStock ? 'green' : 'red'}
                        >
                            ⬤
                        </SizableText>
                    )}

                    {/* Option name */}
                    <SizableText
                        f={1}
                        miw={0} // ✅ crucial for truncation in flex row
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        color="$color"
                        textTransform="capitalize"
                        textDecorationLine={disabled ? 'line-through' : 'none'}
                    >
                        {option}
                    </SizableText>

                    {/* Price */}
                    <SizableText
                        flexShrink={0} // ✅ price stays visible
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        color="$color"
                        textDecorationLine={!inStock ? 'line-through' : 'none'}
                    >
                        {minPrice
                            ? minPrice === maxPrice
                                ? formatMinorWithHeader(minPrice, minPrices,)
                                : `Fra ${formatMinorWithHeader(minPrice, minPrices)}`
                            : null}
                    </SizableText>
                </XStack>
            </Pressable>
        </Theme >
    );
};
