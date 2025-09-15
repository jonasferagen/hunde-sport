// components/cart/CartList.tsx
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
        renderItem={({ item: key }) => <CartListItem itemKey={key} />}
        showsVerticalScrollIndicator={false}
      />
    </ThemedYStack>
  );
};
