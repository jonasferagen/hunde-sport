
import { usePurchasableContext } from "@/contexts";
import { Purchasable } from "@/types";
import React from "react";
import { openModal } from "./ModalStore";
import { ProductVariationsModal } from "./ProductVariationsModal";
import { PurchaseButton } from "./PurchaseButton";

import { useCartContext } from "@/contexts/CartContext";

export const ProductPurchaseFlow = () => {
    const { purchasable } = usePurchasableContext();
    const { addItem } = useCartContext();


    const onPressSimpleProduct = () => {
        addItem(purchasable);
    }

    const onPressVariableProduct = () => {
        openModal<Purchasable>(
            (payload, api) => (
                <ProductVariationsModal
                    purchasable={payload}
                    close={() => api.close()}
                />
            ),
            purchasable
        )
    }
    const onPress = purchasable.isVariable ? onPressVariableProduct : onPressSimpleProduct;

    return (
        <PurchaseButton onPress={onPress} />
    );
};