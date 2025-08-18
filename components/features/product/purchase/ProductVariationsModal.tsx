// ProductVariationsModal.tsx
import { ThemedButton, ThemedXStack, ThemedYStack } from '@/components/ui';
import { PurchasableProvider, usePurchasableContext } from '@/contexts/PurchasableContext';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useDeferredOpen } from '@/hooks/useDeferredOpen';
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


/*
function useMeasure() {
    const [h, setH] = React.useState(0);
    const onLayout = React.useCallback((e: any) => {
        const next = Math.round(e.nativeEvent.layout.height);
        if (next !== h) setH(next);
    }, [h]);
    return [h, onLayout] as const;
} */

export const Inner = React.memo(function Inner({ close }: { close: () => void }) {
    const { purchasable } = usePurchasableContext();
    const addToCart = useAddToCart();
    const [loading, setLoading] = React.useState(false);
    const ready = useDeferredOpen([purchasable.product.id], 50);

    const CTA_HEIGHT = 56; // your button height (+ margins)
    const [bodyH, setBodyH] = React.useState(0);
    const [headerH, setHeaderH] = React.useState(0);
    const [footerH, setFooterH] = React.useState(0);
    const [contentH, setContentH] = React.useState(0);

    const onBodyLayout = (e: any) => setBodyH(Math.round(e.nativeEvent.layout.height));
    const onHeaderLayout = (e: any) => setHeaderH(Math.round(e.nativeEvent.layout.height));
    const onFooterLayout = (e: any) => setFooterH(Math.round(e.nativeEvent.layout.height));

    const IMAGE_H = 200;
    const paddings = 0; // if your frame has vertical padding, add it here
    const availableForOptions = Math.max(0, bodyH - headerH - IMAGE_H - footerH - CTA_HEIGHT - paddings);
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
            {/* header */}
            <ThemedXStack split onLayout={onHeaderLayout}>
                <ProductTitle fs={1} />
                <ThemedButton circular onPress={close}><ChevronDown /></ThemedButton>
            </ThemedXStack>

            {/* image */}
            <ProductImage img_height={IMAGE_H} />

            {/* attributes (auto-fit; scroll only if needed) */}
            {ready ? (
                needsScroll ? (
                    <Sheet.ScrollView
                        maxHeight={availableForOptions}
                        keyboardShouldPersistTaps="handled"
                        onContentSizeChange={(_w, h) => setContentH(Math.round(h))}
                        contentContainerStyle={{ paddingBottom: 12 }} // some breathing room
                    >
                        <ProductVariationSelect />
                    </Sheet.ScrollView>
                ) : (
                    <YStack f={1}
                        onLayout={(e) => setContentH(Math.round(e.nativeEvent.layout.height))}
                    >
                        <ProductVariationSelect />
                    </YStack>
                )
            ) : null}

            {/* status & price */}
            <ThemedYStack onLayout={onFooterLayout}>
                <ProductVariationLabel />
                <ThemedXStack split>
                    <ProductStatus />
                    <ProductPrice />
                </ThemedXStack>
            </ThemedYStack>

            {/* CTA pinned bottom */}
            <ThemedYStack mt="$2" mb="$3">
                <PurchaseButton
                    // mode="auto" so it morphs to BUY when valid
                    onPress={onPress}
                    isLoading={loading}
                    enabled={purchasable.isValid}
                />
            </ThemedYStack>
        </ThemedYStack>
    );
});