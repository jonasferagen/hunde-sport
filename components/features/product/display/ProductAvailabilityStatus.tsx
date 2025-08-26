import { ThemedText } from '@/components/ui';
import { ProductAvailability } from '@/types';
import { XStack } from 'tamagui';


interface Props {
    productAvailability: ProductAvailability;
    showInStock?: boolean;
}

export const ProductAvailabilityStatus = ({ productAvailability, showInStock = true }: Props) => {
    const { isInStock: inStock, isOnBackOrder } = productAvailability;

    const green = 'green';
    const yellow = 'yellow';
    const red = 'red';

    const color = inStock ? green : isOnBackOrder ? yellow : red;
    const text = inStock ? 'På lager' : isOnBackOrder ? 'På vei' : 'Utsolgt';

    return showInStock || !inStock ? (
        <XStack gap="$1">
            <ThemedText col={color}>⬤</ThemedText><ThemedText> {text}</ThemedText>
        </XStack>
    ) : null;
};
