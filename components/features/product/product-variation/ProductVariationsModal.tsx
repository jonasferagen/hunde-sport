import { Modal } from '@/components/ui/modal/Modal';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { ProductVariationProvider, useProductVariationContext } from '@/contexts/ProductVariationContext';
import { VariableProduct } from '@/models/Product/Product';
import React from 'react';
import { ScrollView, YStack } from 'tamagui';
import { PurchaseButton } from '../display/PurchaseButton';
import { VariationButton } from '../display/VariationButton';
import { ProductImage } from '../ProductImage';
import { ProductVariations } from './ProductVariations';
import { ProductVariationTitle } from './ProductVariationTitle';

export const ProductVariationsModal = () => {
    const { product: variableProduct } = useBaseProductContext();
    const [open, setOpen] = React.useState(false);

    const product = variableProduct as VariableProduct;


    return (
        <>
            <VariationButton onPress={() => {
                setOpen(true);
            }} />
            {open && (
                <Modal open={open} onOpenChange={setOpen} title={product.name}>
                    <ProductVariationProvider product={product}>
                        <ProductVariationsContent product={product} setOpen={setOpen} />
                    </ProductVariationProvider>
                </Modal>
            )}
        </>
    );
};

interface ProductVariationsContentProps {
    product: VariableProduct;
    setOpen: (open: boolean) => void;
}

export const ProductVariationsContent = ({ product, setOpen }: ProductVariationsContentProps) => {
    const { isLoading, productVariations, setSelectedProductVariation } = useProductVariationContext();


    if (isLoading) return <ThemedSpinner />

    return (

        <YStack f={1} h="100%" gap="$3" theme="active">
            <ProductImage img_height={150} />
            <ProductVariationTitle />
            <ScrollView f={1} >
                {<ProductVariations
                    key={product.id}
                    product={product}
                    productVariations={productVariations || []}
                    onProductVariationSelected={setSelectedProductVariation}
                />}
            </ScrollView>
            <PurchaseButton f={0} mb="$3" onPurchase={() => setOpen(false)} />
        </YStack>

    );
};
