import { Modal } from '@/components/ui/modal/Modal';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { VariableProduct } from '@/models/Product/Product';
import { ProductVariations } from './ProductVariations';

import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { useProductVariationContext } from '@/contexts/ProductVariationContext';
import React from 'react';
import { VariationButton } from '../display/VariationButton';

export const ProductVariationsModal = () => {

    const { product } = useBaseProductContext();
    const { isLoading, productVariations, setSelectedProductVariation } = useProductVariationContext();
    const [open, setOpen] = React.useState(false);
    if (isLoading) {
        return <ThemedSpinner />;
    }
    return (
        <>
            <VariationButton onPress={() => setOpen(true)} />
            <Modal open={open} onOpenChange={(open) => { setOpen(open) }}>
                <ProductVariations
                    product={product as VariableProduct}
                    productVariations={productVariations || []}
                    onProductVariationSelected={setSelectedProductVariation}
                />
            </Modal>
        </>
    );
}