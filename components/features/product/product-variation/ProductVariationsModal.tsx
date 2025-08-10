import { Modal } from '@/components/ui/modal/Modal';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { ThemedYStack } from '@/components/ui/themed-components/ThemedStack';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { ProductVariationProvider, useProductVariationContext } from '@/contexts/ProductVariationContext';
import { VariableProduct } from '@/models/Product/Product';
import React from 'react';
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
                {open && (
                    <ProductVariationProvider product={product}>
                        <ProductVariationsContent product={product} />
                    </ProductVariationProvider>
                )}
            </Modal>
        </>
    );
};

/*
return (
    <>
        <VariationButton onPress={() => setOpen(true)} />
        <Modal open={open} onOpenChange={setOpen}>
            {open && (
                <ProductVariationProvider product={product}>
                    <ProductVariationsContent product={product} />
                </ProductVariationProvider>
            )}
        </Modal>
    </>
);*/



const ProductVariationsContent = ({ product }: { product: VariableProduct }) => {

    const { isLoading, productVariations, setSelectedProductVariation } = useProductVariationContext();

    if (isLoading) return <ThemedSpinner />;

    return (

        <ThemedYStack debugColor="green">
            <ProductTitle />
            <ProductVariations
                product={product}
                productVariations={productVariations || []}
                onProductVariationSelected={setSelectedProductVariation}
            />
            <PurchaseButton />
        </ThemedYStack>

    );
};
