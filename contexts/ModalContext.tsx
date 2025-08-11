import { Purchasable } from "@/types";
import React, { createContext, useContext, useState, useTransition } from "react";

interface ModalContextType {
    purchasable?: Purchasable;
    open: boolean;
    setPurchasable: (purchasable: Purchasable) => void;
    toggleModal: () => void;
    modalType: "variations" | "quantity" | null;
    setModalType: (modalType: "variations" | "quantity" | null) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [purchasable, setPurchasable] = useState<Purchasable | undefined>(undefined);
    const [modalType, setModalType] = useState<"variations" | "quantity" | null>(null);
    const [open, setOpen] = useState(false);

    const [isPending, startTransition] = useTransition(); // Track the transition state

    const toggleModal = () => {
        startTransition(() => {
            setOpen(!open); // This will now run as a transition, allowing smooth state update
        });
    };

    return (
        <ModalContext.Provider value={{
            open,
            purchasable,
            setPurchasable,
            toggleModal,
            modalType,
            setModalType
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModalContext must be used within a ModalProvider");
    }
    return context;
};
