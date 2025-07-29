import { useOrderContext, useShoppingCartContext } from '@/contexts';
import { OrderLineItem } from '@/models/Order';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';

const CheckoutSync = () => {
  const { items } = useShoppingCartContext();
  const { updateOrder } = useOrderContext();

  useEffect(() => {
    const lineItems: OrderLineItem[] = items.map((item) => ({
      product_id: item.purchasable.product.id,
      quantity: item.quantity,
      variation_id: item.purchasable.productVariation?.id,
    }));
    updateOrder({ line_items: lineItems });
  }, [items, updateOrder]);

  return null; // This component does not render anything
};

export default function CheckoutLayout() {
  return (
    <>
      <CheckoutSync />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
