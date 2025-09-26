import type { ApiResponse } from "apisauce";

import { Cart, type CartData } from "@/domain/cart/Cart";
import type { CartAddItemOptions } from "@/domain/cart/types";
import { endpoints } from "@/hooks/api/api";
import { getApiClient } from "@/lib/api/apiClient";

function handleResponse(
  response: ApiResponse<CartData>,
  context: string
): Cart {
  // transport-level issues (network, timeout, 4xx/5xx etc.)
  if (response.problem) {
    throw new Error(`${context}: ${response.problem}`);
  }
  const data = response.data;

  if (!data) {
    throw new Error(`${context}: No data returned`);
  }

  // apisauce normalizes header names to lower-case
  const token =
    (response.headers?.["cart-token"] as string | undefined) ??
    (response.headers?.["x-wc-store-api-cart-token"] as string | undefined); // fallback, just in case

  if (!token) {
    throw new Error(`${context}: Cart token not found in response headers`);
  }

  // IMPORTANT: returns a Cart *instance* (not a plain object)
  return Cart.create(data, token);
}

/**
 * Fetches the cart from the API.
 * @returns {Promise<Cart>} The cart data and token.
 */
export async function fetchCart(cartToken?: string): Promise<Cart> {
  const apiClient = getApiClient();
  apiClient.headers["cart-token"] = cartToken || "";
  const response = await apiClient.get<any>(endpoints.cart.get());
  return handleResponse(response, "fetchCart");
}

export async function addItem(
  cartToken: string,
  options: CartAddItemOptions
): Promise<Cart> {
 const apiClient = getApiClient();
  apiClient.headers["cart-token"] = cartToken;

  const response = await apiClient.post<any>(
    endpoints.cart.addItem(),
    options
  );
 

 return handleResponse(response, "addItem");

}
/**
 * Updates an item's quantity in the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {string} key - The unique key of the item in the cart.
 * @param {number} quantity - The new quantity for the item.
 * @returns {Promise<Cart>} An object containing the updated cart data.
 */
export async function updateItem(
  cartToken: string,
  { key, quantity }: { key: string; quantity: number }
): Promise<Cart> {
   const apiClient = getApiClient();
  apiClient.headers["cart-token"] = cartToken;
  const response = await apiClient.post<any>(endpoints.cart.updateItem(), {
    key,
    quantity,
  });

  return handleResponse(response, "updateItem");
}

/**
 * Removes an item from the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {string} key - The unique key of the item in the cart.
 * @returns {Promise<Cart>} An object containing the updated cart data.
 */
export async function removeItem(
cartToken: string,
  { key }: { key: string }
): Promise<Cart> {
   const apiClient = getApiClient();
  apiClient.headers["cart-token"] = cartToken;
  const response = await apiClient.post<any>(endpoints.cart.removeItem(), {
    // Woocommerce uses POST for removal
    key,
  });
  return handleResponse(response, "removeItem");
}
