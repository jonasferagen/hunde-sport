import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { Cart } from "@/domain/cart/Cart";
import { useCartHasHydrated, useCartToken } from "@/stores/useCartStore";

import { fetchCart } from "./api";

export const useCart = (options = { enabled: true }): UseQueryResult<Cart> => {
  const hasHydrated = useCartHasHydrated();
  const cartToken = useCartToken();

  const result = useQuery({
    queryKey: ["cart", cartToken || ""], // tie cache to token
    enabled: options.enabled && hasHydrated, // wait for rehydration
    queryFn: () => fetchCart(cartToken), // include token if present
  });
  return result;
};
