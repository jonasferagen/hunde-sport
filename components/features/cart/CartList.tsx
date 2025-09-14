// components/cart/CartList.tsx
import React from "react";

import { VerticalList } from "@/components/lists/VerticalList";
import { ThemedYStack } from "@/components/ui/themed";
import { DefaultTextContent } from "@/components/widgets/DefaultTextContent";
import { useCartStore } from "@/stores/useCartStore";

import { CartListItem } from "./CartListItem";

export const CartList = () => {
  const keys = useCartStore((s) => s.cart.itemKeys);

  if (!keys.length) {
    return <DefaultTextContent>Handlekurven er tom</DefaultTextContent>;
  }

  return (
    <ThemedYStack f={1} mih={0}>
      <VerticalList<string>
        data={keys}
        // Either one of these works. Using getStableId keeps the generic clean.
        getStableId={(k) => k}
        // keyExtractor={(k) => k}
        renderItem={({ item: key }) => <CartListItem itemKey={key} />}
        // Re-animate only when the count changes (or swap for a store `version`).
        animateFirstTimeKey={keys.length}
        // Layout / behavior

        showsVerticalScrollIndicator={false}
      />
    </ThemedYStack>
  );
};
