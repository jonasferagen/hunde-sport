import type {
  WcItemPrices,
  WcItemTotals,
} from "@/adapters/woocommerce/cartPricing";
import { StoreImage, type StoreImageData } from "@/domain/StoreImage";
import { cleanHtml, slugKey } from "@/lib/formatters";

type CartItemVariationData = {
  raw_attribute?: string;
  attribute: string;
  value: string;
};

type CartItemVariation = {
  attribute: string;
  value: string;
  attribute_key: string;
  term_key: string;
};

/** Incoming shape from the Store API (or your transport layer) */
export type CartItemData = {
  key: string;
  id: number; // line item product/variation id
  type: string; // "simple" | "variation"
  name: string; // parent product name
  variation?: CartItemVariationData[];
  prices: WcItemPrices;
  totals: WcItemTotals;
  quantity: number;
  images: StoreImageData[];
};

/** Normalized, internal representation used by the domain model */
type NormalizedCartItem = {
  key: string;
  id: number;
  type: "simple" | "variation" | string;
  name: string;
  variation: CartItemVariation[];
  prices: WcItemPrices;
  totals: WcItemTotals;
  quantity: number;
  images: StoreImage[];
};

export class CartItem implements NormalizedCartItem {
  readonly key: string;
  readonly id: number;
  readonly type: "simple" | "variation" | string;
  readonly name: string;
  readonly variation: CartItemVariation[];
  readonly prices: WcItemPrices;
  readonly totals: WcItemTotals;
  readonly quantity: number;
  readonly images: StoreImage[];

  /** Use `create()` — constructor is private to guarantee normalized inputs */
  private constructor(data: NormalizedCartItem) {
    this.key = data.key;
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
    this.variation = data.variation;
    this.prices = data.prices;
    this.totals = data.totals;
    this.quantity = data.quantity;
    this.images = data.images;
  }

  /** Factory: normalize nullable/optional fields and enforce safe defaults */
  static create(raw: CartItemData): CartItem {
    const variation = raw.variation
      ? (raw.variation ?? []).map((v) => {
          return {
            attribute: cleanHtml(v.attribute),
            value: cleanHtml(v.value),
            attribute_key: slugKey(v.attribute),
            term_key: slugKey(v.value),
          };
        })
      : [];

    const images = (
      raw.images && raw.images.length > 0 ? raw.images : [StoreImage.DEFAULT]
    ).map(StoreImage.create);

    return new CartItem({
      key: raw.key,
      id: raw.id,
      type: (raw.type as "simple" | "variation") ?? "simple",
      name: raw.name,
      variation,
      prices: raw.prices,
      totals: raw.totals,
      quantity: raw.quantity,
      images,
    });
  }

  /** true when the line is a variation product (most variable parents) */
  get isVariation(): boolean {
    return this.type === "variation";
  }

  /** map attribute -> value for convenient lookups */
  get attributesMap(): ReadonlyMap<string, string> {
    return new Map(this.variation.map((v) => [v.attribute, v.value]));
  }

  /** "Mint / XXS/XS" */
  get variationLabel(): string {
    if (!this.variation.length) return "";
    return this.variation.map((v) => v.value).join(", ");
  }

  /** "Foret Sele – Mint / XXS/XS" */
  get title(): string {
    const suffix = this.variationLabel;
    return suffix ? `${this.name} – ${suffix}` : this.name;
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
      variation: this.variation,
      prices: this.prices,
      totals: this.totals,
      quantity: next,
      images: this.images,
    });
  }
}
