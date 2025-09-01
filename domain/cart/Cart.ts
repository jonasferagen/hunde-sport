// domain/Cart/models.ts
import { CartItem, CartItemData } from "./CartItem";
import type { WcTotals } from "./misc";

/** Raw Store API cart payload shape */
export type CartData = {
  items?: CartItemData[];
  items_weight?: number;
  totals: WcTotals;
  has_calculated_shipping?: boolean;
  shipping_rates?: unknown;
};

/** Internal normalized shape */
type NormalizedCart = {
  items: readonly CartItem[];
  token: string;
  itemsWeight: number;
  totals: WcTotals;
  hasCalculatedShipping: boolean;
  shippingRates: unknown;
  lastUpdated: number;
};

type CartInitPatch = Partial<Omit<NormalizedCart, "token">>;

export class Cart implements NormalizedCart {
  readonly items: readonly CartItem[];
  readonly token: string;
  readonly itemsWeight: number;
  readonly totals: WcTotals;
  readonly hasCalculatedShipping: boolean;
  readonly shippingRates: unknown;
  readonly lastUpdated: number;

  /** Always use create/rebuild */
  private constructor(data: NormalizedCart) {
    this.items = data.items;
    this.token = data.token;
    this.itemsWeight = data.itemsWeight;
    this.totals = data.totals;
    this.hasCalculatedShipping = data.hasCalculatedShipping;
    this.shippingRates = data.shippingRates;
    this.lastUpdated = data.lastUpdated;
  }

  /** Build domain Cart from raw payload + token header */
  static create(data: CartData, token: string): Cart {
    const items = Object.freeze(
      (data.items ?? []).map((i) => CartItem.create(i))
    );
    return new Cart({
      items,
      token,
      itemsWeight: data.items_weight ?? 0,
      totals: data.totals,
      hasCalculatedShipping: !!data.has_calculated_shipping,
      shippingRates: data.shipping_rates ?? null,
      lastUpdated: Date.now(),
    });
  }

  /** Rebuild a Cart from an existing one with a partial patch (immutable) */
  static rebuild(base: Cart, patch: CartInitPatch): Cart {
    return new Cart({
      items: (patch.items as readonly CartItem[]) ?? base.items,
      token: base.token, // token is preserved
      itemsWeight: patch.itemsWeight ?? base.itemsWeight,
      totals: patch.totals ?? base.totals,
      hasCalculatedShipping:
        patch.hasCalculatedShipping ?? base.hasCalculatedShipping,
      shippingRates: patch.shippingRates ?? base.shippingRates,
      lastUpdated: patch.lastUpdated ?? base.lastUpdated,
    });
  }

  static readonly DEFAULT = Object.freeze(
    Cart.create(
      {
        items: [],
        items_weight: 0,
        totals: {
          currency_code: "NOK",
          currency_minor_unit: 2,
          currency_prefix: "kr",
          currency_suffix: "",
          currency_thousand_separator: ".",
          currency_decimal_separator: ",",
          total_price: "0",
          total_tax: "0",
          total_items: "0",
          total_items_tax: "0",
          total_shipping: "0",
          total_shipping_tax: "0",
          total_discount: "0",
          total_discount_tax: "0",
        },
      },
      "token"
    ) as Cart
  );
  /** Sum of line quantities */
  get totalQuantity(): number {
    return this.items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
    // quantity is required on CartItem, but the fallback keeps this resilient
  }

  /** Return a new Cart with the given items (adjusts itemsCount + lastUpdated) */
  withItems(items: readonly CartItem[]): Cart {
    const frozen = Object.freeze(items.slice());
    return Cart.rebuild(this, {
      items: frozen,
      lastUpdated: Date.now(),
    });
  }

  /** Return a new Cart with a single line’s quantity updated (immutable) */
  withUpdatedQuantity(key: string, quantity: number): Cart {
    const next = this.items.map((it) =>
      it.key === key ? it.withQuantity(quantity) : it
    );
    return this.withItems(next);
  }

  /** Return a new Cart without the given line key */
  withoutItem(key: string): Cart {
    const next = this.items.filter((it) => it.key !== key);
    return this.withItems(next);
  }
}
