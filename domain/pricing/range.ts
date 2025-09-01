import type { ProductPriceRange, ProductPrices } from "./types";

export function getProductPriceRange(
  prices: ProductPrices[]
): ProductPriceRange {
  if (prices.length === 0) throw new Error("No prices provided");

  const valid = prices.filter((p) => Number(p.price) !== 0);
  const list = valid.length ? valid : [prices[0]];

  let min = list[0];
  let max = list[0];

  for (let i = 1; i < list.length; i++) {
    const p = list[i];
    const n = Number(p.price);
    if (n < Number(min.price)) min = p;
    if (n > Number(max.price)) max = p;
  }

  return { min, max };
}
