import { Product, type ProductData } from "./Product";

export class SimpleProduct extends Product {
  private constructor(data: ReturnType<typeof Product.mapBase>) {
    if (data.type !== "simple")
      throw new Error("Invalid data type for SimpleProduct");
    super(data);
  }

  static create(data: ProductData): SimpleProduct {
    if (data.type !== "simple")
      throw new Error("fromData(simple) received non-simple");
    const base = Product.mapBase(data, "simple");
    return new SimpleProduct(base);
  }
}
