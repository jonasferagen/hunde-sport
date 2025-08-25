
import React from "react";
import { openModal } from "@/stores/modalStore";
import { ProductVariationsModal } from "./ProductVariationsModal";
import { PurchaseButton } from "./PurchaseButton";

import { useAddToCart } from "@/hooks/useAddToCart";

// ProductPurchaseFlow.tsx
import { PurchasableProvider } from "@/contexts";
import { haptic } from '@/lib/haptics';
import { createPurchasable, Purchasable, PurchasableProduct } from "@/types";

export const ProductPurchaseFlow = ({ product }: { product: PurchasableProduct }) => {
    const addToCart = useAddToCart();

    const purchasable = React.useMemo(
        () => createPurchasable({ product, productVariation: undefined }),
        [product]
    );

    const [loading, setLoading] = React.useState(false);

    const onPressSimple = async () => {
        if (loading) return
        setLoading(true)
        try { await addToCart(purchasable, 1) } finally { setLoading(false) }
    }
    const onPressVariable = () => {
        haptic.light(); // or haptic.light()
        openModal(
            (payload, api) => (
                <ProductVariationsModal purchasable={payload as Purchasable} close={() => api.close()} />
            ),
            purchasable,
        );
    };

    const onPress = purchasable.isVariable ? onPressVariable : onPressSimple;

    return (<PurchasableProvider purchasable={purchasable}>
        <PurchaseButton onPress={onPress} isLoading={loading} />
    </PurchasableProvider>);

};
