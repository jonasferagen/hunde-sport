import { ArrowBigRight } from "@tamagui/lucide-icons";
import React, { useCallback, useMemo } from "react";
import { Linking } from "react-native";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { THEME_CTA_CHECKOUT } from "@/config/app";
import { formatCartItemsTotal } from "@/domain/cart/misc";
import { useCartStore } from "@/stores/useCartStore";

export const CheckoutButton = () => {
  const cart = useCartStore((s) => s.cart);
  const totalQuantity = cart.totalQuantity;
  const formattedTotal = formatCartItemsTotal(cart.totals);

  const isUpdating = useCartStore((s) => s.isUpdating);
  // Actions are stable in Zustand; read via getState to avoid subscribing
  const checkout = useCartStore.getState().checkout;

  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const onPress = useCallback(async () => {
    setIsRedirecting(true);
    try {
      const checkoutUrl = await checkout();
      await Linking.openURL(checkoutUrl.toString());
    } finally {
      setIsRedirecting(false);
    }
  }, [checkout]);

  const disabled = cart.items.length === 0;
  const waiting = isUpdating || isRedirecting;

  const label = "Til kassen";
  const label_r = useMemo(
    () =>
      `${totalQuantity} ${totalQuantity === 1 ? "vare" : "varer"}, ${formattedTotal}`,
    [totalQuantity, formattedTotal]
  );
  const iconAfter = useMemo(() => <ArrowBigRight scale={1.5} />, []);

  return (
    <CallToActionButton
      onPress={onPress}
      disabled={disabled}
      theme={THEME_CTA_CHECKOUT}
      label={label}
      label_r={label_r}
      after={iconAfter}
      loading={waiting}
    />
  );
};
