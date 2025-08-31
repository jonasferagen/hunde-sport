import { Product, type ProductData } from "./Product";

export class SimpleProduct extends Product {
  private constructor(data: ReturnType<typeof Product.mapBase>) {
    if (data.type !== "simple")
      throw new Error("Invalid data type for SimpleProduct");
    super(data);
  }

  static fromRaw(raw: ProductData): SimpleProduct {
    if (raw.type !== "simple")
      throw new Error("fromRaw(simple) received non-simple");
    const base = Product.mapBase(raw, "simple");
    return new SimpleProduct(base);
  }
}
