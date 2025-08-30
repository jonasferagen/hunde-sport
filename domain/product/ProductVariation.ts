import { Product, type RawBaseProduct } from "./Product";

export class ProductVariation extends Product {
  readonly parent: number;
  readonly variation?: string;

  private constructor(
    data: ReturnType<typeof Product.mapBase> & {
      parent: number;
      variation?: string;
    }
  ) {
    if (data.type !== "variation")
      throw new Error("Invalid data type for ProductVariation");
    super(data);
    this.parent = data.parent;
    this.variation = data.variation;
  }

  static fromRaw(
    raw: RawBaseProduct & { variation?: string }
  ): ProductVariation {
    if (raw.type !== "variation")
      throw new Error("fromRaw(variation) received non-variation");
    const base = Product.mapBase(raw, "variation");
    return new ProductVariation({
      ...base,
      parent: raw.parent,
      variation: raw.variation,
    });
  }
}
