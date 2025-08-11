import { Modal } from '@/components/ui/modal/Modal';
import { PurchasableProvider, useModalContext } from "@/contexts";
import { VariableProduct } from "@/types";
import React from 'react';
import { ProductVariationsContent } from './ProductVariationsContent';
import { QuantitySelectContent } from './QuantitySelectContent';


export const ProductModal = () => {
    const { purchasable, open, modalType, toggleModal } = useModalContext();
    if (!open) {
        return null;
    }
    if (!purchasable) throw new Error("Trying to open a ProductModal with no purchasable");

    const product = purchasable.product as VariableProduct;
    const productVariation = purchasable.productVariation;

    return (
        <Modal open={open} onOpenChange={toggleModal} title={product.name}>
            <PurchasableProvider product={product} productVariation={productVariation}>
                {modalType === "variations" ? (
                    <ProductVariationsContent />
                ) : modalType === "quantity" ? (
                    <QuantitySelectContent />
                ) : null}
            </PurchasableProvider>
        </Modal>
    );
};