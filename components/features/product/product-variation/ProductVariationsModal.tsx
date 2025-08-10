import { Modal } from '@/components/ui/modal/Modal';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/models/Product/Product';
import { ProductVariations } from './ProductVariations';

import React from 'react';
import { VariationButton } from '../display/VariationButton';

export const ProductVariationsModal = () => {

    const { isLoading, product, productVariations, setSelectedProductVariation } = useProductContext();
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