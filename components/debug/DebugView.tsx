import { useDebug } from '@/contexts';
import { X } from '@tamagui/lucide-icons';
import { JSX } from 'react';
import { SizableText, YStack } from 'tamagui';

export const DebugView = (): JSX.Element | null => {
    const { product, isOpen, setIsOpen } = useDebug();

    if (!isOpen || !product) {
        return null;
    }

    return (
        <YStack
            p="$4"
            gap="$2"
            position="absolute"
            top="$10"
            left="$4"
            right="$4"
            zIndex={9998}
            bg="$background"
            br="$4"
            borderWidth={1}
            borderColor="$borderColor"
            shadowColor="$shadowColor"
            shadowRadius={10}
            shadowOffset={{ width: 0, height: 5 }}
            elevation={5}
        >
            <YStack position="absolute" top="$2" right="$2" onPress={() => setIsOpen(false)} p="$2">
                <X size={24} color="$color" />
            </YStack>

            <SizableText size="$6" fow="bold">
                Product Info
            </SizableText>
            <SizableText>ID: {product.id}</SizableText>
            <SizableText>Type: {product.type}</SizableText>
            <YStack>
                <SizableText fow="bold">Prices ({product.prices.currency_symbol})</SizableText>
                <SizableText>Price: {product.prices.price}</SizableText>
                <SizableText>Regular: {product.prices.regular_price}</SizableText>
                <SizableText>Sale: {product.prices.sale_price}</SizableText>
                {product.prices.price_range && (
                    <SizableText>
                        Range: {product.prices.price_range.min_amount} - {product.prices.price_range.max_amount}
                    </SizableText>
                )}
            </YStack>
        </YStack>
    );
};
