// ProductVariationsModal.tsx
import { ThemedButton, ThemedXStack, ThemedYStack } from '@/components/ui';
import { PurchasableProvider, usePurchasableContext } from '@/contexts/PurchasableContext';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useDeferredOpen } from '@/hooks/useDeferredOpen';
import { spacePx } from '@/lib/helpers';
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



function useMeasure() {
    const [h, setH] = React.useState(0);
    const onLayout = React.useCallback((e: any) => {
        const next = Math.round(e.nativeEvent.layout.height);
        if (next !== h) setH(next);
    }, [h]);
    return [h, onLayout] as const;
}

export const Inner = React.memo(function Inner({ close }: { close: () => void }) {
    const { purchasable } = usePurchasableContext();
    const addToCart = useAddToCart();
    const [loading, setLoading] = React.useState(false);
    const ready = useDeferredOpen([purchasable.product.id], 50);

    // measure containers
    const [bodyH, onBodyLayout] = useMeasure();
    const [headerH, onHeaderLayout] = useMeasure();
    const [footerH, onFooterLayout] = useMeasure();
    const [contentH, setContentH] = React.useState(0);

    // known pieces
    const IMAGE_H = 200;
    const paddings = spacePx('$4') + spacePx('$3'); // adjust if your gaps change
    // how much space can the options area occupy
    const availableForOptions = Math.max(0, bodyH - headerH - IMAGE_H - footerH - paddings);
    const needsScroll = contentH > availableForOptions + 1;

    const onPress = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await addToCart(purchasable, 1);
            if (res.ok) close();
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedYStack f={1} mih={0} onLayout={onBodyLayout}>
            {/* Header */}
            <ThemedXStack split onLayout={onHeaderLayout}>
                <ProductTitle fs={1} />
                <ThemedButton circular onPress={close}><ChevronDown /></ThemedButton>
            </ThemedXStack>

            {/* Image (fixed height) */}
            <ProductImage img_height={IMAGE_H} />

            {/* Options: auto-fit; only scroll if needed */}
            {ready ? (
                needsScroll ? (
                    <Sheet.ScrollView
                        // IMPORTANT: no flex here; cap to fit
                        maxHeight={availableForOptions}
                        keyboardShouldPersistTaps="handled"
                        onContentSizeChange={(_w, h) => setContentH(Math.round(h))}
                    >
                        <YStack pb="$4">
                            <ProductVariationSelect />
                        </YStack>
                    </Sheet.ScrollView>
                ) : (
                    <YStack
                        pb="$4"
                        // measure when not scrolling
                        onLayout={(e) => setContentH(Math.round(e.nativeEvent.layout.height))}
                    >
                        <ProductVariationSelect />
                    </YStack>
                )
            ) : null}

            {/* Footer (status + price + CTA) */}
            <ThemedYStack onLayout={onFooterLayout}>
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
