// domain/Cart/models.ts
import type { WcItemPrices, WcItemTotals, WcTotals } from "./pricing";

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
type RawCartItem = {
  key: string;
  id: number; // line item product/variation id
  type: string; // "simple" | "variation"
  name: string; // parent product name
  variations: CartItemVariation[];
  prices: WcItemPrices;
  totals: WcItemTotals;
  quantity: number;
  permalink?: string;
  images?: { id: number; src: string; thumbnail?: string }[];
  // plus any other fields we don't model now
};
export type CartItemVariation = {
  raw_attribute?: string; // e.g. "attribute_pa_farge"
  attribute: string; // e.g. "farge" or "Størrelse"
  value: string; // e.g. "Mint", "XXS/XS"
};

export class CartItem {
  readonly key: string;
  readonly id: number;
  readonly type: string;
  readonly name: string;
  readonly variations: readonly CartItemVariation[];
  readonly prices: WcItemPrices;
  readonly totals: WcItemTotals;
  readonly quantity: number;
  readonly permalink?: string;
  readonly images?: readonly { id: number; src: string; thumbnail?: string }[];

  constructor(raw: RawCartItem) {
    this.key = raw.key;
    this.id = raw.id;
    this.type = raw.type;
    this.name = raw.name;
    this.variations = raw.variations ?? [];
    this.prices = raw.prices;
    this.totals = raw.totals;
    this.quantity = raw.quantity;
    this.permalink = raw.permalink;
    this.images = raw.images;
  }

  /** true when the line is a variation product (most variable parents) */
  get isVariation(): boolean {
    return this.type === "variation";
  }

  /** map attribute -> value for convenient lookups */
  get attributesMap(): ReadonlyMap<string, string> {
    return new Map(this.variations.map((v) => [v.attribute, v.value]));
  }

  /** "Mint / XXS/XS" */
  get variationLabel(): string {
    if (!this.variations.length) return "";
    return this.variations.map((v) => v.value).join(" / ");
  }

  /** "Foret Sele – Mint / XXS/XS" */
  get title(): string {
    const suffix = this.variationLabel;
    return suffix ? `${this.name} – ${suffix}` : this.name;
  }

  /** Parent product URL (strip query from permalink like ?attribute_pa_...) */
  get parentPermalink(): string | undefined {
    if (!this.permalink) return undefined;
    const q = this.permalink.indexOf("?");
    return q >= 0 ? this.permalink.slice(0, q) : this.permalink;
  }

  /** Unit price in minor units (e.g. øre) */
  get unitMinor(): number {
    return parseInt(this.prices.price ?? "0", 10) || 0;
  }

  /** Unit price in major units (e.g. NOK) */
  get unitMajor(): number {
    const mu = this.prices.currency_minor_unit ?? 2;
    return this.unitMinor / Math.pow(10, mu);
  }

  /** Line total in minor units */
  get lineTotalMinor(): number {
    return parseInt(this.totals.line_total ?? "0", 10) || 0;
  }

  /** Line total in major units */
  get lineTotalMajor(): number {
    const mu =
      this.totals.currency_minor_unit ?? this.prices.currency_minor_unit ?? 2;
    return this.lineTotalMinor / Math.pow(10, mu);
  }
}

export type RawCart = {
  items: RawCartItem[];
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
  static fromRaw(raw: RawCart, token: string): Cart {
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
