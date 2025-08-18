// AttributeOption.tsx — compact row; no zIndex; fixed/min height
import { THEME_OPTION, THEME_OPTION_SELECTED } from '@/config/app';
import { formatMinorWithHeader } from '@/domain/pricing';
import { AttributeTermDetails } from '@/types';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, Theme, XStack } from 'tamagui';
// AttributeOption.tsx
interface AttributeOptionProps {
    option: string;
    selectOption: () => void;
    isSelected: boolean;
    item: AttributeTermDetails;
}
export const AttributeOption = React.memo(function AttributeOption({
    option, selectOption, isSelected, item
}: AttributeOptionProps) {
    const { isAvailable, inStock, minPrices, maxPrices } = item;

    // allow selection unless the option is truly unavailable
    const disabled = !isAvailable;

    const priceText = React.useMemo(() => {
        const min = minPrices?.price ?? null;
        const max = maxPrices?.price ?? null;
        if (!min) return null;
        return min === max
            ? formatMinorWithHeader(min, minPrices)
            : `Fra ${formatMinorWithHeader(min, minPrices)}`;
    }, [minPrices?.price, maxPrices?.price]);

    return (
        <Theme name={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}>
            <Pressable
                onPress={selectOption}
                disabled={disabled}
                hitSlop={8}
                style={{ opacity: disabled ? 0.5 : 1 }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled }}
            >
                <XStack
                    w="100%"
                    ai="center"
                    jc="space-between"
                    p="$3"
                    bw={2}
                    br="$3"
                    boc="$borderColor"
                    bg="$background"
                    gap="$2"
                    minHeight={44}
                >
                    <SizableText fos="$2" fow="bold" color={inStock ? 'green' : 'red'}>⬤</SizableText>

                    <SizableText
                        f={1}
                        miw={0}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textTransform="capitalize"
                        mx="$2"
                        // you can still *style* based on inStock
                        textDecorationLine={!inStock ? 'line-through' : 'none'}
                    >
                        {option}
                    </SizableText>

                    <SizableText flexShrink={0} textAlign="right">{priceText}</SizableText>
                </XStack>
            </Pressable>
        </Theme>
    );
});
