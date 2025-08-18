// ProductVariationsModal.tsx
import { ThemedButton, ThemedXStack, ThemedYStack } from '@/components/ui';
import { PurchasableProvider, usePurchasableContext } from '@/contexts/PurchasableContext';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useDeferredOpen } from '@/hooks/useDeferredOpen';
import { haptic } from '@/lib/haptics';
import { Purchasable } from '@/types';
import { ChevronDown } from '@tamagui/lucide-icons';
import React from 'react';
import { Sheet, YStack } from 'tamagui';
import { ProductImage, ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from '../display';
import { ProductVariationSelect } from '../product-variation/ProductVariationSelect';
import { PurchaseButton } from './PurchaseButton';
export const ProductVariationsModal = ({
    close,
    purchasable,
}: { close: () => void; purchasable: Purchasable }) => {
    return (
        <PurchasableProvider key={purchasable.product.id} purchasable={purchasable}>
            <Inner close={close} />
        </PurchasableProvider>
    );
};

const Inner = React.memo(function Inner({ close }: { close: () => void }) {
    const addToCart = useAddToCart();
    const { purchasable } = usePurchasableContext();
    const [loading, setLoading] = React.useState(false);


    // mount heavy bits after interactions (and after sheet anim)
    const ready = useDeferredOpen([purchasable.product.id], 50);

    const onPress = async () => {
        setLoading(true);
        try {
            await addToCart(purchasable);
            haptic.success();
            close();
        } catch {
            haptic.error();
        } finally {
            setLoading(false);
        }
    };
    return (
        <ThemedYStack f={1} mih={0}>
            <ThemedXStack split>
                <ProductTitle fs={1} />
                <ThemedButton circular onPress={close}><ChevronDown /></ThemedButton>
            </ThemedXStack>
            <ProductImage img_height={200} />
            <Sheet.ScrollView f={1} mih={0} keyboardShouldPersistTaps="handled">
                <YStack pb="$4">
                    {ready ? <ProductVariationSelect /> : null}
                </YStack>
            </Sheet.ScrollView>
            <ThemedYStack>
                <ProductVariationLabel />
                <ThemedXStack split>
                    <ProductStatus />
                    <ProductPrice />
                </ThemedXStack>
            </ThemedYStack>

            <ThemedYStack gap="$3" f={0} mb="$3">
                <PurchaseButton
                    mode="auto"
                    enabled={purchasable.isValid}
                    onPress={onPress}
                    isLoading={loading}
                />
            </ThemedYStack>
        </ThemedYStack>
    );
});
