import { Minus, Plus, X } from "@tamagui/lucide-icons";
import { H4, StackProps, XStack } from "tamagui";

import {
  ThemedSpinner,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui";
import { ThemedButton } from "@/components/ui/themed-components/ThemedButton";
import { THEME_CART_ITEM_1, THEME_CART_ITEM_2 } from "@/config/app";
import { CartItem } from "@/domain/cart/CartItem";
import {
  formatItemLineTotal,
  formatItemUnitPrice,
} from "@/domain/cart/pricing";
import { useCartStore } from "@/stores/cartStore";

interface CartListItemProps {
  item: CartItem;
  index: number;
}

export const CartListItem = ({
  item,
  index,
  ...props
}: CartListItemProps & StackProps) => {
  const { updateItem, removeItem, isUpdating } = useCartStore();
  const { quantity, key } = item;

  return (
    <ThemedYStack gap="none" {...props}>
      <ThemedYStack box theme={THEME_CART_ITEM_1}>
        <ThemedXStack container split f={1}>
          <ThemedText size="$5" fs={1}>
            {item.name}
          </ThemedText>
          <ThemedText size="$5">{formatItemUnitPrice(item.prices)}</ThemedText>
        </ThemedXStack>
      </ThemedYStack>

      <ThemedYStack box theme={THEME_CART_ITEM_2}>
        <ThemedXStack container gap="$2" ai="center">
          <XStack ai="center" gap="$2">
            <ThemedButton
              onPress={() => updateItem(key, quantity - 1)}
              circular
              disabled={quantity <= 1}
            >
              <Minus />
            </ThemedButton>
            <H4 w={30} ta="center">
              {quantity}
            </H4>
            <ThemedButton
              onPress={() => updateItem(key, quantity + 1)}
              circular
            >
              <Plus />
            </ThemedButton>
          </XStack>

          <XStack f={1} ai="center" jc="flex-end">
            {isUpdating ? (
              <ThemedSpinner />
            ) : (
              <ThemedText ta="right" size="$5">
                {formatItemLineTotal(item.totals)}
              </ThemedText>
            )}
          </XStack>

          <ThemedButton onPress={() => removeItem(key)} circular>
            <X />
          </ThemedButton>
        </ThemedXStack>
      </ThemedYStack>
    </ThemedYStack>
  );
};
