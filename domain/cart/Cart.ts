// domain/Cart/models.ts
import { CartItem, CartItemData } from "./CartItem";
import type { WcTotals } from "./misc";

/** Raw Store API cart payload shape */
export type CartData = {
  items?: CartItemData[];
  token?: string; // NOTE: you pass token separately via headers; keep optional here
  items_count?: number; // distinct lines
  items_weight?: number;
  totals: WcTotals;
  has_calculated_shipping?: boolean;
  shipping_rates?: unknown;
};

/** Internal normalized shape */
type NormalizedCart = {
  items: readonly CartItem[];
  token: string;
  itemsCount: number;
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
  readonly itemsCount: number;
  readonly itemsWeight: number;
  readonly totals: WcTotals;
  readonly hasCalculatedShipping: boolean;
  readonly shippingRates: unknown;
  readonly lastUpdated: number;

  /** Always use create/rebuild */
  private constructor(data: NormalizedCart) {
    this.items = data.items;
    this.token = data.token;
    this.itemsCount = data.itemsCount;
    this.itemsWeight = data.itemsWeight;
    this.totals = data.totals;
    this.hasCalculatedShipping = data.hasCalculatedShipping;
    this.shippingRates = data.shippingRates;
    this.lastUpdated = data.lastUpdated;
  }

  /** Sum of line quantities */
  get totalQuantity(): number {
    return this.items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
    // quantity is required on CartItem, but the fallback keeps this resilient
  }

  /** Build domain Cart from raw payload + token header */
  static create(raw: CartData, token: string): Cart {
    const items = Object.freeze(
      (raw.items ?? []).map((i) => CartItem.create(i))
    );

    return new Cart({
      items,
      token,
      itemsCount: raw.items_count ?? items.length,
      itemsWeight: raw.items_weight ?? 0,
      totals: raw.totals,
      hasCalculatedShipping: !!raw.has_calculated_shipping,
      shippingRates: raw.shipping_rates ?? null,
      lastUpdated: Date.now(),
    });
  }

  /** Rebuild a Cart from an existing one with a partial patch (immutable) */
  static rebuild(base: Cart, patch: CartInitPatch): Cart {
    return new Cart({
      items: (patch.items as readonly CartItem[]) ?? base.items,
      token: base.token, // token is preserved
      itemsCount: patch.itemsCount ?? base.itemsCount,
      itemsWeight: patch.itemsWeight ?? base.itemsWeight,
      totals: patch.totals ?? base.totals,
      hasCalculatedShipping:
        patch.hasCalculatedShipping ?? base.hasCalculatedShipping,
      shippingRates: patch.shippingRates ?? base.shippingRates,
      lastUpdated: patch.lastUpdated ?? base.lastUpdated,
    });
  }

  /** Return a new Cart with the given items (adjusts itemsCount + lastUpdated) */
  withItems(items: readonly CartItem[]): Cart {
    const frozen = Object.freeze(items.slice());
    return Cart.rebuild(this, {
      items: frozen,
      itemsCount: frozen.length,
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
