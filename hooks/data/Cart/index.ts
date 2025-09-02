import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { Cart } from "@/domain/cart/Cart";

import { fetchCart } from "./api";

export const useCart = (options = { enabled: true }): UseQueryResult<Cart> => {
  const result = useQuery({
    queryKey: ["cart"],
    queryFn: () => fetchCart(),
    ...options,
  });
  return result;
};
