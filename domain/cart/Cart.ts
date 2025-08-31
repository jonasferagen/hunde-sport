// domain/Cart/models.ts
import { CartItem, CartItemData } from "./CartItem";
import type { WcTotals } from "./pricing";

/** Raw variation pair in the cart item payload */

type CartInit = {
  items: CartItem[];
  token: string;
  itemsCount: number;
  itemsWeight: number;
  totals: WcTotals;
  hasCalculatedShipping: boolean;
  shippingRates: any;
  lastUpdated: number;
};

export type CartData = {
  items: CartItemData[];
  token: string;
  items_count: number; // count of distinct lines
  items_weight: number;
  totals: WcTotals;
  has_calculated_shipping: boolean;
  shipping_rates: any;
};

export class Cart {
  items: CartItem[];
  token: string;
  itemsCount: number; // distinct lines
  itemsWeight: number;
  totals: WcTotals;
  hasCalculatedShipping: boolean;
  shippingRates: any;
  lastUpdated: number;

  constructor(
    items: CartItem[],
    token: string,
    itemsCount: number,
    itemsWeight: number,
    totals: WcTotals,
    hasCalculatedShipping: boolean,
    shippingRates: any,
    lastUpdated: number
  ) {
    this.items = items;
    this.token = token;
    this.itemsCount = itemsCount;
    this.itemsWeight = itemsWeight;
    this.totals = totals;
    this.hasCalculatedShipping = hasCalculatedShipping;
    this.shippingRates = shippingRates;
    this.lastUpdated = lastUpdated;
  }

  /** total quantity across lines (sum of line quantities) */
  get totalQuantity(): number {
    return this.items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
  }

  /** build domain Cart from raw API payload */
  static fromRaw(raw: CartData, token: string): Cart {
    const items = (raw.items ?? []).map((i) => new CartItem(i));
    return new Cart(
      items,
      token,
      raw.items_count ?? items.length,
      raw.items_weight ?? 0,
      raw.totals,
      raw.has_calculated_shipping ?? false,
      raw.shipping_rates,
      Date.now()
    );
  }

  static rebuild(base: Cart, patch: Partial<CartInit>): Cart {
    return new Cart(
      patch.items ?? [...base.items],
      base.token,
      patch.itemsCount ?? base.itemsCount,
      patch.itemsWeight ?? base.itemsWeight,
      patch.totals ?? base.totals,
      patch.hasCalculatedShipping ?? base.hasCalculatedShipping,
      patch.shippingRates ?? base.shippingRates,
      patch.lastUpdated ?? base.lastUpdated
    );
  }

  /** Return a new Cart with the given items (adjusts itemsCount + lastUpdated) */
  withItems(items: CartItem[]): Cart {
    return Cart.rebuild(this, {
      items,
      itemsCount: items.length,
      lastUpdated: Date.now(),
    });
  }

  /** Return a new Cart with a single line’s quantity updated */
  withUpdatedQuantity(key: string, quantity: number): Cart {
    const items = this.items.map((it) =>
      it.key === key ? new CartItem({ ...(it as any), quantity }) : it
    );
    return this.withItems(items);
  }

  /** Return a new Cart without the given line key */
  withoutItem(key: string): Cart {
    const items = this.items.filter((it) => it.key !== key);
    return this.withItems(items);
  }
}
