import type { CartItemVariation, WcItemPrices, WcItemTotals } from "./misc";

/** Incoming shape from the Store API (or your transport layer) */
export type CartItemData = {
  key: string;
  id: number; // line item product/variation id
  type: string; // "simple" | "variation"
  name: string; // parent product name
  variations?: CartItemVariation[];
  prices: WcItemPrices;
  totals: WcItemTotals;
  quantity: number;
  permalink?: string | null;
  images?: { id: number; src: string; thumbnail?: string | null }[] | null;
};

/** Normalized, internal representation used by the domain model */
type NormalizedCartItem = {
  key: string;
  id: number;
  type: "simple" | "variation" | string;
  name: string;
  variations: readonly CartItemVariation[];
  prices: WcItemPrices;
  totals: WcItemTotals;
  quantity: number;
  permalink?: string;
  images: readonly { id: number; src: string; thumbnail: string }[];
};

export class CartItem implements NormalizedCartItem {
  readonly key: string;
  readonly id: number;
  readonly type: "simple" | "variation" | string;
  readonly name: string;
  readonly variations: readonly CartItemVariation[];
  readonly prices: WcItemPrices;
  readonly totals: WcItemTotals;
  readonly quantity: number;
  readonly permalink?: string;
  readonly images: readonly { id: number; src: string; thumbnail: string }[];

  /** Use `create()` — constructor is private to guarantee normalized inputs */
  private constructor(data: NormalizedCartItem) {
    this.key = data.key;
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
    this.variations = data.variations;
    this.prices = data.prices;
    this.totals = data.totals;
    this.quantity = data.quantity;
    this.permalink = data.permalink;
    this.images = data.images;
  }

  /** Factory: normalize nullable/optional fields and enforce safe defaults */
  static create(raw: CartItemData): CartItem {
    const variations: readonly CartItemVariation[] = Object.freeze(
      Array.isArray(raw.variations) ? raw.variations.slice() : []
    );

    const images: readonly { id: number; src: string; thumbnail: string }[] =
      Object.freeze(
        Array.isArray(raw.images)
          ? raw.images.map((img) => ({
              id: typeof img.id === "number" ? img.id : 0,
              src: img.src ?? "",
              thumbnail: img.thumbnail ?? img.src ?? "",
            }))
          : []
      );

    const permalink =
      typeof raw.permalink === "string" && raw.permalink.length > 0
        ? raw.permalink
        : undefined;

    return new CartItem({
      key: raw.key,
      id: raw.id,
      type: (raw.type as "simple" | "variation") ?? "simple",
      name: raw.name,
      variations,
      prices: raw.prices,
      totals: raw.totals,
      quantity: raw.quantity,
      permalink,
      images,
    });
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
    const v = this.prices.price ?? "0";
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }

  /** Unit price in major units (e.g. NOK) */
  get unitMajor(): number {
    const mu = this.prices.currency_minor_unit ?? 2;
    return this.unitMinor / Math.pow(10, mu);
  }

  /** Line total in minor units */
  get lineTotalMinor(): number {
    const v = this.totals.line_total ?? "0";
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }

  /** Line total in major units */
  get lineTotalMajor(): number {
    const mu =
      this.totals.currency_minor_unit ?? this.prices.currency_minor_unit ?? 2;
    return this.lineTotalMinor / Math.pow(10, mu);
  }

  /** Optional helper: return a new item with a different quantity (immutable) */
  withQuantity(next: number): CartItem {
    return new CartItem({
      key: this.key,
      id: this.id,
      type: this.type,
      name: this.name,
      variations: this.variations,
      prices: this.prices,
      totals: this.totals,
      quantity: next,
      permalink: this.permalink,
      images: this.images,
    });
  }
}
