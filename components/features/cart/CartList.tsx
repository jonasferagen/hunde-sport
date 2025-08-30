import { FlashList } from "@shopify/flash-list";

import { ThemedYStack } from "@/components/ui";
import { DefaultTextContent } from "@/components/ui/DefaultTextContent";
import { useCartStore } from "@/stores/cartStore";

import { CartListItem } from "./CartListItem";

export const CartList = () => {
  const items = useCartStore((s) => s.cart?.items ?? []);

  if (!items.length) {
    return <DefaultTextContent>Handlekurven er tom</DefaultTextContent>;
  }
  return (
    <ThemedYStack f={1} mih={0}>
      <FlashList
        data={items}
        keyExtractor={(i) => i.key}
        renderItem={({ item, index }) => (
          <CartListItem item={item} index={index} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        removeClippedSubviews={false} // safer with item animations; or just omit
      />
    </ThemedYStack>
  );
};
