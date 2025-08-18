
import { usePurchasableContext } from "@/contexts/";
import React from "react";
import { openModal } from "../../../../stores/modalStore";
import { ProductVariationsModal } from "./ProductVariationsModal";
import { PurchaseButton } from "./PurchaseButton";

import { useAddToCart } from "@/hooks/useAddToCart";

// ProductPurchaseFlow.tsx
import { haptic } from '@/lib/haptics';
import { Purchasable } from "@/types";

export const ProductPurchaseFlow = () => {
    const addToCart = useAddToCart();
    const { purchasable } = usePurchasableContext();
    const [loading, setLoading] = React.useState(false);

    const onPressSimple = async () => {
        if (loading) return
        setLoading(true)
        try { await addToCart(purchasable, 1) } finally { setLoading(false) }
    }
    const onPressVariable = () => {
        haptic.selection(); // or haptic.light()
        openModal(
            (payload, api) => (
                <ProductVariationsModal purchasable={payload as Purchasable} close={() => api.close()} />
            ),
            purchasable,
        );
    };

    const onPress = purchasable.isVariable ? onPressVariable : onPressSimple;
    return <PurchaseButton onPress={onPress} isLoading={loading} />;
};
