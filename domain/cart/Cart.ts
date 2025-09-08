// domain/Cart/models.ts
import { Totals, type TotalsData } from "@/domain/pricing/Totals";

import { CartItem, type CartItemData } from "./CartItem";

export type CartData = {
  items?: CartItemData[];
  items_weight?: number;
  totals: TotalsData | Totals; // ⬅️ accepts raw or normalized
  has_calculated_shipping?: boolean;
  shipping_rates?: unknown;
};

type NormalizedCart = {
  items: readonly CartItem[];
  token: string;
  itemsWeight: number;
  totals: Totals;
  hasCalculatedShipping: boolean;
  shippingRates: unknown;
  lastUpdated: number;
};

type CartInitPatch = Partial<Omit<NormalizedCart, "token">>;

type Derived = {
  itemKeys: readonly string[];
  itemsByKey: ReadonlyMap<string, CartItem>;
};

export class Cart implements NormalizedCart {
  readonly items: readonly CartItem[];
  readonly token: string;
  readonly itemsWeight: number;
  readonly totals: Totals;
  readonly hasCalculatedShipping: boolean;
  readonly shippingRates: unknown;
  readonly lastUpdated: number;

  // cached derived data
  readonly _itemKeys: readonly string[];
  readonly _itemsByKey: ReadonlyMap<string, CartItem>;

  private constructor(data: NormalizedCart, derived?: Derived) {
    this.items = data.items;
    this.token = data.token;
    this.itemsWeight = data.itemsWeight;
    this.totals = data.totals;
    this.hasCalculatedShipping = data.hasCalculatedShipping;
    this.shippingRates = data.shippingRates;
    this.lastUpdated = data.lastUpdated;

    if (derived) {
      this._itemKeys = derived.itemKeys;
      this._itemsByKey = derived.itemsByKey;
    } else {
      this._itemKeys = Object.freeze(data.items.map((i) => i.key));
      this._itemsByKey = new Map(data.items.map((i) => [i.key, i] as const));
    }
  }

  // ---- readonly getters for UI/selectors ----
  get itemKeys(): readonly string[] {
    return this._itemKeys;
  }
  get itemsByKey(): ReadonlyMap<string, CartItem> {
    return this._itemsByKey;
  }

  static create(data: CartData, token: string): Cart {
    const items = Object.freeze(
      (data.items ?? []).map((i) => CartItem.create(i))
    );

    const totals =
      data.totals instanceof Totals ? data.totals : Totals.create(data.totals);

    return new Cart({
      items,
      token,
      itemsWeight: data.items_weight ?? 0,
      totals,
      hasCalculatedShipping: !!data.has_calculated_shipping,
      shippingRates: data.shipping_rates ?? null,
      lastUpdated: Date.now(),
    });
  }

  static rebuild(base: Cart, patch: CartInitPatch): Cart {
    const items = (patch.items as readonly CartItem[]) ?? base.items;

    if (items === base.items) {
      return new Cart(
        {
          items,
          token: base.token,
          itemsWeight: patch.itemsWeight ?? base.itemsWeight,
          totals: patch.totals ?? base.totals,
          hasCalculatedShipping:
            patch.hasCalculatedShipping ?? base.hasCalculatedShipping,
          shippingRates: patch.shippingRates ?? base.shippingRates,
          lastUpdated: patch.lastUpdated ?? base.lastUpdated,
        },
        { itemKeys: base._itemKeys, itemsByKey: base._itemsByKey }
      );
    }

    const derived: Derived = {
      itemKeys: Object.freeze(items.map((i) => i.key)),
      itemsByKey: new Map(items.map((i) => [i.key, i] as const)),
    };

    return new Cart(
      {
        items,
        token: base.token,
        itemsWeight: patch.itemsWeight ?? base.itemsWeight,
        totals: patch.totals ?? base.totals,
        hasCalculatedShipping:
          patch.hasCalculatedShipping ?? base.hasCalculatedShipping,
        shippingRates: patch.shippingRates ?? base.shippingRates,
        lastUpdated: patch.lastUpdated ?? base.lastUpdated,
      },
      derived
    );
  }

  // ✅ DEFAULT uses create() with complete, explicit values
  static readonly DEFAULT = Object.freeze(
    Cart.create(
      {
        items: [],
        items_weight: 0,
        totals: Totals.DEFAULT, // works via the soft-landing in create()
        has_calculated_shipping: false,
        shipping_rates: null,
      },
      "token"
    ) as Cart
  );

  get totalQuantity(): number {
    return this.items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
  }

  withItems(items: readonly CartItem[]): Cart {
    const frozen = Object.freeze(items.slice());
    const derived: Derived = {
      itemKeys: Object.freeze(frozen.map((i) => i.key)),
      itemsByKey: new Map(frozen.map((i) => [i.key, i] as const)),
    };
    return new Cart(
      {
        ...this,
        items: frozen,
        lastUpdated: Date.now(),
      },
      derived
    );
  }

  withUpdatedQuantity(key: string, quantity: number): Cart {
    const next = this.items.map((it) =>
      it.key === key ? it.withQuantity(quantity) : it
    );
    return this.withItems(next);
  }

  withoutItem(key: string): Cart {
    const next = this.items.filter((it) => it.key !== key);
    return this.withItems(next);
  }
}
