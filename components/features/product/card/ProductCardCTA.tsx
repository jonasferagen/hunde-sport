// ProductCTA.tsx
import { ProductVariationsContent } from '@/components/features/product/product-variation/ProductVariationsButton';
import { ThemedButton, ThemedText } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { Modal } from '@/components/ui/modal/Modal';
import { ProductVariationProvider } from '@/contexts';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { usePurchasable } from '@/hooks/usePurchasable';
import { VariableProduct } from '@/types';
import { Menu, ShoppingCart, X } from '@tamagui/lucide-icons';
import React from 'react';
import { SizableText, XStack } from 'tamagui';
import { BaseProductPrice } from '../display/ProductPrice';



const icons = {
    VARIATION_REQUIRED: <Menu />,
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
                w="100%"
                ai="center"
                ref={buttonRef}
                theme="primary_strong"
                onPress={() => setOpen(true)}
                disabled={disabled}
                size="$4"
            >
                <ThemedButton.Icon>
                    {icon}
                </ThemedButton.Icon>
                <ThemedButton.Text>
                    <ThemedText fos="$4">
                        {message}
                    </ThemedText>
                </ThemedButton.Text>
                <ThemedButton.After>
                    <BaseProductPrice fos="$4" />
                </ThemedButton.After>
            </ThemedButton>
            {modal}

        </>
    );
};


const ProductVariationModal = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
    const { product: baseProduct } = useBaseProductContext();
    const product = baseProduct as VariableProduct;
    return (
        <Modal open={open} onOpenChange={setOpen} title={product.name}>
            <ProductVariationProvider product={product}>
                <ProductVariationsContent product={product} setOpen={setOpen} />
            </ProductVariationProvider>
        </Modal>
    );
}

const QuantityModal = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
    return (
        <Modal open={open} onOpenChange={setOpen} title="Antall">
            <XStack ai="center" jc="center">
                <SizableText>aaa</SizableText>
            </XStack>
        </Modal>
    );
}