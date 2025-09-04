import { Product, type ProductData } from "./Product";

export class VariableProductVariant extends Product {
  readonly parent: number;
  readonly variation?: string;

  private constructor(
    data: ReturnType<typeof Product.mapBase> & {
      parent: number;
      variation?: string;
    }
  ) {
    if (data.type !== "variation")
      throw new Error("Invalid data type for VariableProductVariant");
    super(data);
    this.parent = data.parent;
    this.variation = data.variation;
  }

  static create(
    data: ProductData & { variation?: string }
  ): VariableProductVariant {
    if (data.type !== "variation")
      throw new Error("fromData(variation) received non-variation");
    const base = Product.mapBase(data, "variation");
    return new VariableProductVariant({
      ...base,
      parent: data.parent,
      variation: data.variation,
    });
  }
}
