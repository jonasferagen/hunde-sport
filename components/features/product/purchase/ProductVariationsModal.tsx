// ProductVariationsModal.tsx
import { ThemedButton, ThemedXStack, ThemedYStack } from '@/components/ui';
import { PurchasableProvider, usePurchasableContext } from '@/contexts/PurchasableContext';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useDeferredOpen } from '@/hooks/useDeferredOpen';
import { closeModal } from '@/stores/modalStore';
import { Purchasable } from '@/types';
import { ChevronDown } from '@tamagui/lucide-icons';
import React from 'react';
import { Sheet } from 'tamagui';
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


    const onPress = async () => {

        if (loading) return;
        setLoading(true);

        try {
            await addToCart(purchasable, 1)
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    return (
        <ThemedYStack f={1} mih={0} onLayout={onBodyLayout}>
            {/* header */}
            <ThemedXStack split onLayout={onHeaderLayout}>
                <ProductTitle product={purchasable.product} fs={1} />
                <ThemedButton circular onPress={close}><ChevronDown /></ThemedButton>
            </ThemedXStack>

            {/* image */}
            <ProductImage product={purchasable.activeProduct} img_height={IMAGE_H} />

            {/* attributes (auto-fit; scroll only if needed) */}
            {ready ? (
                <Sheet.ScrollView
                    // IMPORTANT: do not set f={1} or flex here
                    style={availableForOptions ? { maxHeight: availableForOptions } : undefined}
                    keyboardShouldPersistTaps="handled"
                    onContentSizeChange={(_w, h) => setContentH(Math.round(h))}
                    scrollEnabled={contentH > availableForOptions}
                    contentContainerStyle={{}}
                >
                    {ready ? <ProductVariationSelect h={availableForOptions} /> : null}
                </Sheet.ScrollView>
            ) : null}

            {/* status & price */}
            <ThemedYStack onLayout={onFooterLayout}>
                <ProductVariationLabel />
                <ThemedXStack split>
                    <ProductStatus />
                    <ProductPrice product={purchasable.activeProduct} />
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