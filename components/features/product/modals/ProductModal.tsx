
import { ThemedButton } from "@/components/ui/themed-components";
import { THEME_MODAL } from "@/config/app";
import { PurchasableProvider, useModalContext } from "@/contexts";
import { Purchasable } from "@/types";
import { ChevronDown } from "@tamagui/lucide-icons";
import React, { useEffect } from "react";
import { H4, Sheet, SizableText, Theme, ThemeName, XStack, YStack } from "tamagui";
import { ProductVariationsContent } from './ProductVariationsContent';
import { QuantitySelectContent } from './QuantitySelectContent';


export const ProductModal = () => {

    const { purchasable: modalPurchasable } = useModalContext();
    const [open, setOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState<"variations" | "quantity" | null>(null);
    const [purchasable, setPurchasable] = React.useState<Purchasable | undefined>(undefined);

    useEffect(() => {
        setPurchasable(modalPurchasable);
        setModalType(modalPurchasable?.product.type === "variable" ? "variations" : "quantity");
        if (modalPurchasable) setOpen(true);
    }, [modalPurchasable]);

    if (!open) return null; // Don't render if the modal is closed
    if (!purchasable) throw new Error("Trying to open a ProductModal with no purchasable");



    const { product, productVariation } = purchasable;

    const handleModalToggle = () => setOpen(!open);


    return (
        <Modal open={open} onOpenChange={handleModalToggle} title={product.name}>
            <PurchasableProvider product={product} productVariation={productVariation}>
                {modalType === "variations" ? (
                    <ProductVariationsContent />
                ) : modalType === "quantity" ? (
                    <QuantitySelectContent />
                ) : null}
            </PurchasableProvider>
        </Modal>
    );
};


interface ModalProps {
    open: boolean;
    title: string;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

const Modal = ({ open, title, onOpenChange, children }: ModalProps) => {
    const theme: ThemeName = THEME_MODAL;
    return React.useMemo(() => (
        <Theme name={theme}>
            <Sheet
                open={open}
                onOpenChange={onOpenChange}
                modal
                snapPointsMode="percent"
                snapPoints={[90]}

                forceRemoveScrollEnabled={true}
                unmountChildrenWhenHidden={false}
                animation="lazy"
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <Sheet.Frame f={1}
                    minHeight={0}
                    p="$4"
                    gap="$3"
                >

                    <ThemedButton
                        pos="absolute"
                        right="$2"
                        top="$2"
                        circular
                        onPress={() => onOpenChange(false)}
                    >
                        <ChevronDown />
                    </ThemedButton>
                    <XStack
                        ai="center"
                        jc="space-between"
                        gap="$2"
                    >
                        <H4
                            fs={1}
                            fow="bold"
                            m={0}
                        >
                            {title}
                        </H4>
                    </XStack>
                    <YStack
                        f={1}
                        minHeight={0}
                    >
                        <SizableText>aaa</SizableText>
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </Theme>
    ), [open, title, children]);
};
/*         <ThemedLinearGradient
                        fullscreen
                        strong
                    />       {children}*/