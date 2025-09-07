import { Product, type ProductData } from "./Product";

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

  static create(data: ProductData & { variation?: string }): ProductVariation {
    if (data.type !== "variation")
      throw new Error("fromData(variation) received non-variation");
    const base = Product.mapBase(data, "variation");
    return new ProductVariation({
      ...base,
      parent: data.parent,
      variation: data.variation,
    });
  }
}
