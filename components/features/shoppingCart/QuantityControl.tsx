import { CustomText, Icon } from '@/components/ui';
import { useThemeContext } from '@/contexts';
import React from 'react';
import { XStack } from 'tamagui';

interface QuantityControlProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
    quantity,
    onIncrease,
    onDecrease,
}) => {
    const { themeManager } = useThemeContext();
    const variant = themeManager.getVariant('accent');

    return (
        <XStack
            alignItems="center"
            justifyContent="flex-end"
            width={100}
            height="auto"
        >
            <XStack
                animation="quick"
                alignItems="center"
                opacity={quantity > 0 ? 1 : 0}
                transform={[{ translateX: quantity > 0 ? 0 : 20 }]}
                pointerEvents={quantity > 0 ? 'auto' : 'none'}
            >
                <XStack onPress={onDecrease} p="$2" pressStyle={{ opacity: 0.7 }}>
                    <Icon
                        name="remove"
                        size="xxl"
                        color={variant.text.secondary}
                    />
                </XStack>
                <CustomText
                    fontSize="$md"
                    fontWeight="600"
                    minWidth={20}
                    textAlign="center"
                >
                    {quantity}
                </CustomText>
            </XStack>

            <XStack onPress={onIncrease} p="$2" pressStyle={{ opacity: 0.7 }}>
                <Icon name="add" size="xxl" color={variant.text.secondary} />
            </XStack>
        </XStack>
    );
};
