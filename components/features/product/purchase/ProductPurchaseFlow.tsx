
import React from "react";

import { openModal } from "@/stores/ui/modalStore";
import { createPurchasable, Purchasable, PurchasableProduct } from "@/types";

import { ProductVariationsModal } from "./ProductVariationsModal";
import { PurchaseButtonSmart } from "./PurchaseButtonSmart";

export const ProductPurchaseFlow = ({ product }: { product: PurchasableProduct }) => {

    const purchasable = React.useMemo(() => createPurchasable({ product, productVariation: undefined }), [product]);

    const onRequestVariation = (purchasable: Purchasable) =>
        openModal(
            (payload, api) => (
                <ProductVariationsModal purchasable={payload as Purchasable} close={() => api.close()} />
            ),
            purchasable
        )

    return <PurchaseButtonSmart purchasable={purchasable} onRequestVariation={onRequestVariation} />

};
