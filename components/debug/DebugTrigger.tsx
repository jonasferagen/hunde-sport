import { useDebug } from '@/contexts/DebugContext';
import { PurchasableProduct } from '@/domain/Product/Product';
import { Info } from '@tamagui/lucide-icons';
import { JSX } from 'react';
import { YStack } from 'tamagui';

interface DebugTriggerProps {
    product: PurchasableProduct;
}

export const DebugTrigger = ({ product }: DebugTriggerProps): JSX.Element => {
    const { setProduct, setIsOpen } = useDebug();

    const handlePress = () => {
        setProduct(product);
        setIsOpen(true);
    };

    return (
        <YStack
            p="$2"
            position="absolute"
            top="$4"
            left="$4"
            zIndex={9999}
            bg="rgba(0,0,0,0.5)"
            br="$4"
            onPress={handlePress}
            pressStyle={{
                scale: 0.9,
            }}
            animateOnly={['transform']}
        >
            <Info size={24} color="white" />
        </YStack>
    );
};
