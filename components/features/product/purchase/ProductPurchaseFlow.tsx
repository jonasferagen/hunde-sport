
import { usePurchasableContext } from "@/contexts";
import { useModalStore, WizardRenderArgs, WizardRenderFn } from "@/stores/modalStore";
import { Purchasable } from "@/types";
import React from "react";
import { PurchaseButton } from "./PurchaseButton";
import { PurchaseWizard } from "./PurchaseWizard";

export const ProductPurchaseFlow = () => {

    const { purchasable } = usePurchasableContext();

    const openModal = useModalStore((s) => s.openModal) as <P>(r: WizardRenderFn<P>, p: P) => void;

    return (
        <PurchaseButton
            onPress={() =>
                openModal(({ close, payload, updatePayload }: WizardRenderArgs<Purchasable>) => (
                    <PurchaseWizard
                        payload={payload}
                        updatePayload={updatePayload}
                        close={close}
                    />
                ), purchasable)
            }
        />
    );
}