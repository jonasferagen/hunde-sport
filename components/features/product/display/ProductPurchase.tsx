
import { usePurchasableContext } from "@/contexts";
import { RenderArgs, RenderFn, useModalStore } from "@/stores/modalStore";
import { Purchasable } from "@/types";
import { ProductVariationsModal } from "../modals/ProductVariationsModal";
import { QuantitySelectModal } from "../modals/QuantitySelectModal";
import { PurchaseButton } from "./PurchaseButton";

export const ProductPurchase = () => {

    const { purchasable } = usePurchasableContext();
    const { isVariable } = purchasable;
    const openModal = useModalStore((s) => s.openModal) as <P>(render: RenderFn<P>, payload?: P) => void;

    return (
        <PurchaseButton
            onPress={() =>
                openModal(({ close, replace }: RenderArgs<Purchasable>) =>
                    isVariable
                        ? <ProductVariationsModal
                            onSelect={(purchasable) => {
                                replace(({ close }) => <QuantitySelectModal onSelect={close} />, purchasable);
                            }}
                        />
                        : <QuantitySelectModal onSelect={close} />
                    , purchasable)
            }
        />
    );
}