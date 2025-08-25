// ProductVariationsModal.tsx
import { ThemedButton, ThemedXStack, ThemedYStack } from '@/components/ui';
import { PurchasableProvider, usePurchasableContext } from '@/contexts/PurchasableContext';
import { useAddToCart } from '@/hooks/useAddToCart';
import { Purchasable } from '@/types';
import React from 'react';
import { Sheet } from 'tamagui';
import { ProductImage, ProductPrice, ProductStatus, ProductTitle } from '../display';
import { ProductVariationSelect } from '../product-variation/ProductVariationSelect';
import { ProductVariationStatus } from '../product-variation/ProductVariationStatus';
import { PurchaseButton } from './PurchaseButton';
import { spacePx } from '@/lib/helpers';
import { useModalStore } from '@/stores/modalStore';
import { X } from '@tamagui/lucide-icons';

const gapPx = spacePx("$3");

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
    const hasOpened = useModalStore((s) => s.status === "open");

    // Track partial selection for display in label
    const [currentSelection, setCurrentSelection] = React.useState<Record<string, string>>({});

    const [bodyH, setBodyH] = React.useState(0);
    const [headerH, setHeaderH] = React.useState(0);
    const [footerH, setFooterH] = React.useState(0);
    const [contentH, setContentH] = React.useState(0);

    const onBodyLayout = (e: any) => setBodyH(Math.round(e.nativeEvent.layout.height));
    const onHeaderLayout = (e: any) => setHeaderH(Math.round(e.nativeEvent.layout.height));
    const onFooterLayout = (e: any) => setFooterH(Math.round(e.nativeEvent.layout.height));

    const IMAGE_H = 150;
    const gaps = 3 * gapPx; // compensate for vertical padding between 

    const cH = headerH + footerH + IMAGE_H + gaps;
    const availableForOptions = Math.max(0, bodyH - cH);

    const onPress = async () => {

        if (loading) return;
        setLoading(true);

        try {
            await addToCart(purchasable, 1)
        } finally {
            setLoading(false);
            close();
        }
    };

    return (
        <ThemedYStack f={1} mih={0} onLayout={onBodyLayout} gap="$3">
            {/* header */}
            <ThemedXStack split onLayout={onHeaderLayout}>
                <ProductTitle product={purchasable.product} fs={1} />
                <ThemedButton circular onPress={close}><X /></ThemedButton>
            </ThemedXStack>

            {/* image */}

            <ThemedYStack w="100%" h={IMAGE_H} >
                {hasOpened &&
                    <ProductImage product={purchasable.activeProduct} img_height={IMAGE_H} />
                }
            </ThemedYStack>

            <Sheet.ScrollView

                style={availableForOptions ? { maxHeight: availableForOptions } : undefined}
                keyboardShouldPersistTaps="always"
                onContentSizeChange={(_w, h) => setContentH(Math.round(h))}
                scrollEnabled={contentH > availableForOptions}
                contentContainerStyle={{}}  // IMPORTANT: do not set f={1} or flex here
            >
                {hasOpened && <ProductVariationSelect
                    h={availableForOptions}
                    onSelectionChange={setCurrentSelection}
                />}
            </Sheet.ScrollView>

            {/* status & price */}
            <ThemedYStack onLayout={onFooterLayout} >
                <ProductVariationStatus
                    product={purchasable.product}
                    productVariation={purchasable.productVariation}
                    currentSelection={currentSelection}
                />
                <ThemedXStack split>
                    <ProductStatus product={purchasable.activeProduct} />
                    <ProductPrice product={purchasable.activeProduct} />
                </ThemedXStack>
                <PurchaseButton
                    // mode="auto" so it morphs to BUY when valid
                    onPress={onPress}
                    isLoading={loading}
                    enabled={purchasable.isValid}
                />
                <ThemedYStack mb="$3" />
            </ThemedYStack>
        </ThemedYStack>
    );
});