// @/domain/cart/CartItem.ts
import { CartItemTotals } from "@/domain/cart/CartItemTotals";
import { Currency } from "@/domain/pricing/Currency";
import { Money } from "@/domain/pricing/Money";
import type { CartItemTotalsData, ProductPrices } from "@/domain/pricing/types";
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

export type CartItemData = {
  key: string;
  id: number;
  type: string; // "simple" | "variation"
  name: string;
  variation?: CartItemVariationData[];
  prices: ProductPrices; // API passthrough
  totals: CartItemTotalsData; // ⬅️ line-item totals API shape
  quantity: number;
  images: StoreImageData[];
};

type NormalizedCartItem = {
  key: string;
  id: number;
  type: "simple" | "variation" | string;
  name: string;
  variation: CartItemVariation[];
  prices: ProductPrices; // keep API shape; we compute Money on demand
  totals: CartItemTotals; // normalized value object
  quantity: number;
  images: StoreImage[];
};

export class CartItem implements NormalizedCartItem {
  readonly key: string;
  readonly id: number;
  readonly type: "simple" | "variation" | string;
  readonly name: string;
  readonly variation: CartItemVariation[];
  readonly prices: ProductPrices;
  readonly totals: CartItemTotals;
  readonly quantity: number;
  readonly images: StoreImage[];

  private constructor(n: NormalizedCartItem) {
    this.key = n.key;
    this.id = n.id;
    this.type = n.type;
    this.name = cleanHtml(n.name);
    this.variation = n.variation;
    this.prices = n.prices;
    this.totals = n.totals;
    this.quantity = n.quantity;
    this.images = n.images;
    Object.freeze(this);
  }

  static create(raw: CartItemData): CartItem {
    const variation: CartItemVariation[] = (raw.variation ?? []).map((v) => ({
      attribute: cleanHtml(v.attribute),
      value: cleanHtml(v.value),
      attribute_key: slugKey(v.attribute),
      term_key: slugKey(v.value),
    }));

    const images = (raw.images && raw.images.length > 0 ? raw.images : [StoreImage.DEFAULT]).map(StoreImage.create);

    return new CartItem({
      key: raw.key,
      id: raw.id,
      type: (raw.type as "simple" | "variation") ?? "simple",
      name: raw.name,
      variation,
      prices: raw.prices,
      totals: CartItemTotals.create(raw.totals),
      quantity: raw.quantity,
      images,
    });
  }

  // ---------- Money/format helpers (replaces old free functions) ----------

  /** Unit price as Money (from `prices.price`, tax-exclusive in most APIs). */
  unitPrice(): Money {
    const currency = Currency.create(this.prices);
    const minor = Number.parseInt(this.prices.price ?? "0", 10) || 0;
    return Money.fromMinor(minor, currency);
  }

  /** Unit price formatted (full, with prefix). */
  formatUnitPrice(): string {
    return this.unitPrice().format({ style: "full", omitPrefix: false });
  }

  /** Line total formatted (full, with prefix). */
  formatLineTotal(discounted = true): string {
    return this.totals.format(discounted);
  }

  get variationLabel(): string {
    if (!this.variation.length) return "";
    return this.variation.map((v) => v.value).join(", ");
  }

  /** "Foret Sele – Mint / XXS/XS" */
  get title(): string {
    const suffix = this.variationLabel;
    return suffix ? `${this.name}, ${suffix}` : this.name;
  }

  // Optional: immutable quantity update for your Cart methods
  withQuantity(quantity: number): CartItem {
    return new CartItem({ ...this, quantity } as NormalizedCartItem);
  }
}
