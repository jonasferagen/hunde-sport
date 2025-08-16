
import { usePurchasableContext } from "@/contexts/";
import React from "react";
import { openModal } from "./ModalStore";
import { ProductVariationsModal } from "./ProductVariationsModal";
import { derivePurchaseCTA, PurchaseButton } from "./PurchaseButton";

import { useAddToCart } from "@/hooks/useAddToCart";


export const ProductPurchaseFlow = () => {
    const addToCart = useAddToCart();
    const { purchasable } = usePurchasableContext();
    const [loading, setLoading] = React.useState(false)

    const cta = derivePurchaseCTA(purchasable);

    const onPressSimple = async () => {
        setLoading(true);
        try { await addToCart(purchasable, 1); }
        finally { setLoading(false); }
    };

    const onPressVariable = () => {
        openModal(
            (payload, api) => <ProductVariationsModal purchasable={payload} close={() => api.close()} />,
            purchasable
        );
    };

    const onPress = purchasable.isVariable && !purchasable.isValid ? onPressVariable : onPressSimple;

    return <PurchaseButton cta={cta} onPress={onPress} isLoading={loading} />;
};