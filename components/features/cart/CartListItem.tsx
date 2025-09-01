import { Minus, Plus, X } from "@tamagui/lucide-icons";
import { useShallow } from "zustand/react/shallow";

import { ThemedText, ThemedXStack, ThemedYStack } from "@/components/ui";
import { InlineSpinnerSwap } from "@/components/ui/InlineSpinnerSwap";
import { ThemedButton } from "@/components/ui/themed-components/ThemedButton";
import { THEME_CART_ITEM_1, THEME_CART_ITEM_2 } from "@/config/app";
import { formatItemLineTotal, formatItemUnitPrice } from "@/domain/cart/misc"; // ⬅️ add this
import { useCartStore } from "@/stores/useCartStore";

const QtyStepper = ({
  value,
  onInc,
  onDec,
  disabled,
}: {
  value: number;
  onInc: () => void;
  onDec: () => void;
  disabled?: boolean;
}) => (
  <ThemedXStack ai="center" gap="$2">
    <ThemedButton circular onPress={onDec} disabled={disabled || value <= 1}>
      <Minus />
    </ThemedButton>
    <ThemedText size="$6" w={34} ta="center">
      {value}
    </ThemedText>
    <ThemedButton circular onPress={onInc} disabled={disabled}>
      <Plus />
    </ThemedButton>
  </ThemedXStack>
);

export const CartListItem = ({ itemKey }: { itemKey: string }) => {
  const item = useCartStore((s) => s.cart.itemsByKey.get(itemKey)!);
  const isUpdating = useCartStore((s) => !!s.updatingKeys?.[itemKey]);
  const { updateItem, removeItem } = useCartStore(
    useShallow((s) => ({ updateItem: s.updateItem, removeItem: s.removeItem }))
  );

  const { key, quantity, name } = item;
  const variation = item.variationLabel;

  return (
    <>
      <ThemedYStack theme={THEME_CART_ITEM_1} box container>
        <ThemedXStack ai="center" jc="center">
          <ThemedYStack f={1} miw={0} jc="center">
            <ThemedText size="$6" numberOfLines={2}>
              {name} {variation}
            </ThemedText>
          </ThemedYStack>
          <ThemedButton
            circular
            interactive={false}
            bg="transparent"
            boc="transparent"
            onPress={() => removeItem(key)}
            aria-label="Fjern"
          >
            <X />
          </ThemedButton>
        </ThemedXStack>
      </ThemedYStack>

      <ThemedYStack theme={THEME_CART_ITEM_2} box container>
        <ThemedXStack ai="center">
          <QtyStepper
            value={quantity}
            onInc={() => updateItem(key, quantity + 1)}
            onDec={() => updateItem(key, quantity - 1)}
          />

          {/* Right side: line total (big) + unit price (small) */}
          <ThemedXStack f={1} ai="center" jc="flex-end">
            <ThemedYStack ai="flex-end" gap="$1">
              <InlineSpinnerSwap
                loading={isUpdating}
                textProps={{ size: "$6" }}
              >
                {formatItemLineTotal(item.totals)}
              </InlineSpinnerSwap>
              <ThemedText size="$2" o={0.7}>
                {formatItemUnitPrice(item.prices)} pr stk
              </ThemedText>
            </ThemedYStack>
          </ThemedXStack>
        </ThemedXStack>
      </ThemedYStack>
    </>
  );
};
