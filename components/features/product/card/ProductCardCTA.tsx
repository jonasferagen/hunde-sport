// ProductCTA.tsx
import { ProductVariationsContent } from '@/components/features/product/product-variation/ProductVariationsButton';
import { ThemedButton, ThemedText } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { Modal } from '@/components/ui/modal/Modal';
import { ProductVariationProvider, useCartContext } from '@/contexts';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { usePurchasable } from '@/hooks/usePurchasable';
import { VariableProduct } from '@/types';
import { CircleAlert, ShoppingCart, X } from '@tamagui/lucide-icons';
import React from 'react';
import { XStack } from 'tamagui';
import { BaseProductPrice } from '../display/ProductPrice';



const icons = {
    VARIATION_REQUIRED: <CircleAlert />,
    OUT_OF_STOCK: <X />,
    INVALID_PRODUCT: <X />,
    OK: <ShoppingCart />
}

export const ProductCardCTA = () => {

    const { product, status, message, isValid } = usePurchasable();
    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef<React.ComponentRef<typeof CallToActionButton>>(null);
    const isVariable = product instanceof VariableProduct;
    const modal = isVariable ? <ProductVariationModal open={open} setOpen={setOpen} /> : <QuantityModal open={open} setOpen={setOpen} />;
    const disabled = !isValid && !isVariable;
    const icon = icons[status];

    return (
        <>
            <ThemedButton
                f={1}
                ref={buttonRef}
                theme="vstrong"
                onPress={() => setOpen(true)}
                disabled={disabled}
                p="$2"
                bw={2}
            >
                <ThemedButton.Icon>
                    {icon}
                </ThemedButton.Icon>
                <ThemedButton.Text fg={1}>
                    <ThemedText fos="$4">
                        {message}
                    </ThemedText>
                </ThemedButton.Text>
                <BaseProductPrice fos="$4" />
            </ThemedButton>
            {modal}
        </>
    );
};


const ProductVariationModal = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
    const { product: baseProduct } = useBaseProductContext();
    const product = baseProduct as VariableProduct;


    return (
        open &&
        <Modal
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
            }}
            title={product.name}
        >
            <ProductVariationProvider product={product}>
                <ProductVariationsContent product={product} setOpen={setOpen} />
            </ProductVariationProvider>
        </Modal>
    )
};


const QuantityModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [qty, setQty] = React.useState(1);
    const purchasable = usePurchasable();
    const { addItem } = useCartContext();
    const [fullyOpen, setFullyOpen] = React.useState(false);
    return (
        <Modal open={open} onOpenChange={setOpen} title="Velg antall">
            <XStack ai="center" jc="center" gap="$3" p="$4">
                <ThemedButton onPress={() => setQty(q => Math.max(1, q - 1))}>–</ThemedButton>
                <ThemedText fos="$6">{qty}</ThemedText>
                <ThemedButton onPress={() => setQty(q => q + 1)}>+</ThemedButton>
            </XStack>
            <ThemedButton
                mt="$4"
                onPress={() => {
                    addItem(purchasable, qty);
                    setOpen(false);
                }}
            >                <ThemedText>Legg i handlekurv</ThemedText>
            </ThemedButton>
        </Modal>
    );
};
