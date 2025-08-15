
import { usePurchasableContext } from "@/contexts";
import { Purchasable } from "@/types";
import React from "react";
import { openModal } from "./ModalStore";
import { ProductVariationsModal } from "./ProductVariationsModal";
import { PurchaseButton } from "./PurchaseButton";

export const ProductPurchaseFlow = () => {
    const { purchasable } = usePurchasableContext();

    console.log(openModal);

    return (
        <PurchaseButton
            onPress={() =>
                openModal<Purchasable>(
                    (payload, api) => (
                        <ProductVariationsModal
                            purchasable={payload}
                            onNext={() => api.close()}
                            onBack={() => api.close()}
                        />
                    ),
                    purchasable,
                    {
                        snapPoints: [90],       // customize per flow if needed
                        initialPosition: 0,
                    }
                )
            }
        />
    );
};