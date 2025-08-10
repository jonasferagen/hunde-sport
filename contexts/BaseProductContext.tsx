// -----------------
// Base product context

import { DebugTrigger } from '@/components/debug/DebugTrigger';
import { DEBUG_PRODUCTS } from '@/config/app';
import { createPurchasable } from '@/models/Product/Purchasable';
import { Purchasable, PurchasableProduct } from "@/types";
import { createContext, useContext, useMemo } from "react";
// -----------------
export interface BaseProductContextType {
    product: PurchasableProduct;
    purchasable: Purchasable;
}

const BaseProductContext = createContext<BaseProductContextType | undefined>(undefined);

export const useBaseProductContext = () => {
    const ctx = useContext(BaseProductContext);
    if (!ctx) throw new Error("useBaseProductContext must be used within a BaseProductProvider");
    return ctx;
};

export const BaseProductProvider: React.FC<{ product: PurchasableProduct; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const purchasable = useMemo(() => createPurchasable({ product }), [product]);

    return (
        <BaseProductContext.Provider value={{ product, purchasable }}>
            {children} {DEBUG_PRODUCTS && <DebugTrigger product={product} />}
        </BaseProductContext.Provider>
    );
};
