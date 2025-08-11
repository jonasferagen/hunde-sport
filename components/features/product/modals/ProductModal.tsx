
import { ThemedButton, ThemedLinearGradient } from "@/components/ui/themed-components";
import { THEME_MODAL } from "@/config/app";
import { PurchasableProvider } from "@/contexts";
import { Purchasable } from "@/types";
import { ChevronDown } from "@tamagui/lucide-icons";
import React from "react";
import { H4, Sheet, Theme, ThemeName, XStack, YStack } from "tamagui";
import { ProductVariationsContent } from './ProductVariationsContent';
import { QuantitySelectContent } from './QuantitySelectContent';


export const ProductModal = () => {

    const [purchasable, setPurchasable] = React.useState<Purchasable | null>(null);
    const [open, setOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState<"variations" | "quantity" | null>(null);

    if (!open) return null; // Don't render if the modal is closed
    if (!purchasable) throw new Error("Trying to open a ProductModal with no purchasable");

    const { product, productVariation } = purchasable;

    const handleModalToggle = () => setOpen(!open);
    const handleModalType = (type: "variations" | "quantity") => setModalType(type);


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
                dismissOnSnapToBottom
                forceRemoveScrollEnabled={true}
                unmountChildrenWhenHidden={true}
                animation="fast"
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <Sheet.Frame f={1}
                    minHeight={0}
                    p="$4"
                    gap="$3"
                >
                    <ThemedLinearGradient
                        fullscreen
                        strong
                    />
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
                        {children}
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </Theme>
    ), [open, title, children]);
};
