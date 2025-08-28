// domain/product/SimpleProduct.ts
import { BaseProduct, BaseProductData } from "./BaseProduct";

export class SimpleProduct extends BaseProduct {
  constructor(data: BaseProductData) {
    if (data.type !== "simple") {
      throw new Error("Invalid data type for SimpleProduct");
    }
    super(data);
  }
}
