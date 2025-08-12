
import { usePurchasableContext } from "@/contexts";
import { useModalStore, WizardRenderArgs, WizardRenderFn } from "@/stores/modalStore";
import { Purchasable } from "@/types";
import React from "react";
import { PurchaseWizard } from "../modals/PurchaseWizard";
import { PurchaseButton } from "./PurchaseButton";

export const ProductPurchaseFlow = () => {

    const { purchasable } = usePurchasableContext();

    const openModal = useModalStore((s) => s.openModal) as <P>(r: WizardRenderFn<P>, p: P) => void;

    return (
        <PurchaseButton
            onPress={() =>
                openModal(({ close, payload, updatePayload, setPosition }: WizardRenderArgs<Purchasable>) => (
                    <PurchaseWizard
                        payload={payload}
                        updatePayload={updatePayload}
                        close={close}
                        setPosition={setPosition}
                    />
                ), purchasable)
            }
        />
    );
}