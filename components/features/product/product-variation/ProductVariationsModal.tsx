import { Modal } from '@/components/ui/modal/Modal';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { ProductVariationProvider, useProductVariationContext } from '@/contexts/ProductVariationContext';
import { VariableProduct } from '@/models/Product/Product';
import React from 'react';
import { ScrollView, YStack } from 'tamagui';
import { ProductTitle } from '../display/ProductTitle';
import { PurchaseButton } from '../display/PurchaseButton';
import { VariationButton } from '../display/VariationButton';
import { ProductVariations } from './ProductVariations';

export const ProductVariationsModal = () => {
    const { product: variableProduct } = useBaseProductContext();
    const [open, setOpen] = React.useState(false);

    const product = variableProduct as VariableProduct;

    return (
        <>
            <VariationButton onPress={() => setOpen(true)} />
            <Modal open={open} onOpenChange={setOpen}>
                {open && <YStack>
                    <ProductVariationProvider product={product}>
                        <ProductVariationsContent product={product} />
                    </ProductVariationProvider>
                </YStack>}
            </Modal>

        </>
    );
};

interface ProductVariationsContentProps {
    product: VariableProduct;
}

export const ProductVariationsContent = ({ product }: ProductVariationsContentProps) => {
    const { isLoading, productVariations, setSelectedProductVariation } = useProductVariationContext();

    return (
        <YStack f={1} minHeight="100%"   >
            <ProductTitle f={0} />
            <ScrollView fg={1} >

                {isLoading ? <ThemedSpinner /> : <ProductVariations
                    key={product.id}
                    product={product}
                    productVariations={productVariations || []}
                    onProductVariationSelected={setSelectedProductVariation}
                />}
            </ScrollView>
            <PurchaseButton f={0} />
        </YStack>
    );
};
