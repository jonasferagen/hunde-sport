// CheckoutButton.tsx
import { ArrowBigRight } from "@tamagui/lucide-icons";
import * as React from "react";
import { Linking } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { formatCartItemsTotal } from "@/adapters/woocommerce/cartPricing";
import { ThemedText, ThemedXStack } from "@/components/ui";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { InlineSpinnerSwap } from "@/components/ui/InlineSpinnerSwap";
import { THEME_CTA_CHECKOUT } from "@/config/app";
import { useCartIsLoading, useCartStore } from "@/stores/useCartStore";

export const CheckoutButton = () => {
  const { qty, hasItems, totals } = useCartStore(
    useShallow((s) => ({
      qty: s.cart.totalQuantity,
      hasItems: s.cart.itemKeys.length > 0,
      totals: s.cart.totals,
    }))
  );
  const isLoading = useCartIsLoading();
  const [redirecting, setRedirecting] = React.useState(false);

  const onPress = React.useCallback(async () => {
    if (redirecting) return;
    setRedirecting(true);
    try {
      const checkoutUrl = await useCartStore.getState().checkout();
      const url = checkoutUrl.toString();
      if (!(await Linking.canOpenURL(url)))
        throw new Error("Cannot open checkout URL");
      await Linking.openURL(url);
    } finally {
      setRedirecting(false);
    }
  }, [redirecting]);

  const trailing = (
    <ThemedXStack ai="center" gap="$2">
      <ThemedText tabular>
        {qty} {qty === 1 ? "vare" : "varer"},
      </ThemedText>
      <InlineSpinnerSwap loading={isLoading}>
        {formatCartItemsTotal(totals)}
      </InlineSpinnerSwap>
    </ThemedXStack>
  );

  return (
    <CallToActionButton
      onPress={onPress}
      disabled={!hasItems}
      theme={THEME_CTA_CHECKOUT}
      label="Til kassen"
      trailing={trailing}
      after={<ArrowBigRight scale={1.5} />}
      loading={redirecting}
    />
  );
};
