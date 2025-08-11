import { Modal } from '@/components/ui/modal/Modal';
import { BaseProductProvider, ProductVariationProvider, useModalContext } from "@/contexts";
import { VariableProduct } from "@/types";
import React from 'react';
import { ProductVariationsContent } from './ProductVariationsContent';
import { QuantitySelectContent } from './QuantitySelectContent';


export const ProductModal = () => {
    const { purchasable, open, modalType, toggleModal } = useModalContext();
    if (!purchasable || !open) return null;

    const { product } = purchasable;
    const variableProduct = product as VariableProduct;

    return (
        <Modal open={open} onOpenChange={toggleModal} title={product.name}>
            {modalType === "variations" ? (
                <ProductVariationProvider product={variableProduct}>
                    <ProductVariationsContent product={variableProduct} />
                </ProductVariationProvider>
            ) : modalType === "quantity" ? (
                <BaseProductProvider product={product}>
                    <QuantitySelectContent />
                </BaseProductProvider>
            ) : null}
        </Modal>
    );
};
