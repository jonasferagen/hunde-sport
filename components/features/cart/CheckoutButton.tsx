import { ArrowBigRight } from "@tamagui/lucide-icons";
import React, { useCallback, useMemo } from "react";
import { Linking } from "react-native";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { THEME_CTA_CHECKOUT } from "@/config/app";
import { formatCartItemsTotal } from "@/domain/cart/misc";
import { useCartStore } from "@/stores/cartStore";

export const CheckoutButton = () => {
  const itemsCount = useCartStore((s) => s.cart?.itemsCount ?? 0);
  const isUpdating = useCartStore((s) => s.isUpdating);
  const formattedTotal = useCartStore((s) =>
    s.cart?.totals ? formatCartItemsTotal(s.cart.totals) : ""
  );
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

  const disabled = itemsCount === 0;
  const waiting = isUpdating || isRedirecting;

  const label2 = useMemo(
    () =>
      `${itemsCount} ${itemsCount === 1 ? "vare" : "varer"}, ${formattedTotal}`,
    [itemsCount, formattedTotal]
  );

  const iconAfter = useMemo(() => <ArrowBigRight scale={1.5} />, []);
  const label = "Til kassen";

  return (
    <CallToActionButton
      onPress={onPress}
      disabled={disabled || waiting}
      theme={THEME_CTA_CHECKOUT}
      label_l={label}
      label={label2}
      after={iconAfter}
      loading={waiting}
    />
  );
};
