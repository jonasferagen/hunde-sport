import { ThemedXStack } from '@/components/ui';
import { Modal } from '@/components/ui/modal/Modal';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { ProductVariationProvider, useProductVariationContext } from '@/contexts/ProductVariationContext';
import { VariableProduct } from '@/models/Product/Product';
import React from 'react';
import { ScrollView, Theme, YStack } from 'tamagui';
import { ProductTitle } from '../display/ProductTitle';
import { PurchaseButton } from '../display/PurchaseButton';
import { VariationButton } from '../display/VariationButton';
import { ProductImage } from '../ProductImage';
import { ProductVariations } from './ProductVariations';

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
                <Modal open={open} onOpenChange={setOpen}>
                    <YStack>
                        <ProductVariationProvider product={product}>
                            <ProductVariationsContent product={product} />
                        </ProductVariationProvider>
                    </YStack>
                </Modal>
            )}
        </>
    );
};

interface ProductVariationsContentProps {
    product: VariableProduct;
}

export const ProductVariationsContent = ({ product }: ProductVariationsContentProps) => {
    const { isLoading, productVariations, setSelectedProductVariation } = useProductVariationContext();


    if (isLoading) return <ThemedSpinner />

    return (
        <Theme name="primary">
            <YStack f={1} minHeight="100%" gap="$3" >
                <ThemedXStack f={0} fs={1}>
                    <ProductTitle />
                </ThemedXStack>
                <ProductImage img_height={100} />
                <ScrollView f={1} >
                    {<ProductVariations
                        key={product.id}
                        product={product}
                        productVariations={productVariations || []}
                        onProductVariationSelected={setSelectedProductVariation}
                    />}
                </ScrollView>
                <PurchaseButton f={0} mb="$3" />
            </YStack>
        </Theme>
    );
};
