import React, {
  createContext,
  JSX,
  useContext,
  useEffect,
  useState,
} from "react";

import { useCartStore } from "@/stores/cartStore";
import { PurchasableProduct } from "@/types";

interface DebugContextType {
  product: PurchasableProduct | null;
  setProduct: (product: PurchasableProduct | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerCartTest: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
};

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  const [product, setProduct] = useState<PurchasableProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Cart test logic (dev-only)
  const addItem = useCartStore((s) => s.addItem);
  const [cartTestDone, setCartTestDone] = useState(false);
  const [autoCartTest, setAutoCartTest] = useState<boolean>(
    typeof __DEV__ !== "undefined" ? __DEV__ : false
  );

  useEffect(() => {
    if (!autoCartTest || cartTestDone) return;
    console.log("TEST: Cart initialized. Adding test item...");
    addItem({ id: 248212, quantity: 1, variation: [] }).finally(() => {
      console.log("TEST: Add item call finished.");
      setCartTestDone(true);
    });
  }, [isInitialized, autoCartTest, cartTestDone, addItem]);

  const triggerCartTest = () => {
    setAutoCartTest(true);
    if (isInitialized && !cartTestDone) {
      console.log("TEST: Manual trigger. Adding test item...");
      addItem({ id: 248212, quantity: 1, variation: [] }).finally(() => {
        console.log("TEST: Add item call finished (manual).");
        setCartTestDone(true);
      });
    }
  };

  const value = {
    product,
    setProduct,
    isOpen,
    setIsOpen,
    triggerCartTest,
  };

  return (
    <DebugContext.Provider value={value}>{children}</DebugContext.Provider>
  );
};
