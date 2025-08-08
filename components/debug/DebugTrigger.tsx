import { useDebug } from '@/contexts';
import { PurchasableProduct } from '@/models/Product/Product';
import { Ionicons } from '@expo/vector-icons';
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
            bottom="$4"
            right="$4"
            zIndex={9999}
            bg="rgba(0,0,0,0.5)"
            br="$12"
            onPress={handlePress}
            pressStyle={{
                scale: 0.9,
            }}
            animateOnly={['transform']}
        >
            <Ionicons name="information-circle-outline" size={24} color="white" />
        </YStack>
    );
};
