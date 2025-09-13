import { FlashList } from "@shopify/flash-list";

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
      <FlashList
        data={keys}
        keyExtractor={(k) => k}
        renderItem={({ item: key }) => <CartListItem itemKey={key} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        removeClippedSubviews={false} // safer with item animations; or just omit
      />
    </ThemedYStack>
  );
};
