
import { usePurchasableContext } from "@/contexts";
import { useModalStore, WizardRenderArgs, WizardRenderFn } from "@/stores/modalStore";
import { Purchasable } from "@/types";
import React from "react";
import { ProductVariationsModal } from "../modals/ProductVariationsModal";
import { QuantitySelectModal } from "../modals/QuantitySelectModal";
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
// PurchaseWizard.tsx — both steps local; “simple product” skips step 0
type PWProps = {
    close: () => void;
    payload: Purchasable;
    updatePayload: (p: Purchasable) => void;
    setPosition: (index: number) => void;
};

const PurchaseWizard = ({ close, payload, updatePayload, setPosition }: PWProps) => {

    const [step, setStep] = React.useState(payload.isVariable ? 0 : 1);

    React.useEffect(() => {
        // pick snap point per step
        setPosition(step === 0 ? 1 : 0); // 1 => 90%, 0 => 50%
    }, [step, setPosition]);

    // Step 0: Variations
    if (step === 0) {
        return (
            <ProductVariationsModal
                onNext={(next) => {
                    updatePayload(next); // update host/context
                    setStep(1);          // advance to quantity
                }}
                onBack={close}
            />
        );
    }
    // Step 1: Quantity
    return (
        <QuantitySelectModal
            onNext={close}
            onBack={payload.isVariable ? () => setStep(0) : close}
        />
    );
}
