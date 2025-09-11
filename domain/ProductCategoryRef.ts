// domain/ProductCategoryRef.ts

/* @TODO For products that only include a reference to a ProductCategory 
 * Should be linked properly
*/

export type ProductCategoryRefData = {
  id: number;
  name: string;
};

export class ProductCategoryRef  {
  id: number;
  name: string;

  private constructor(data: ProductCategoryRefData) {
    this.id = data.id;
    this.name = data.name;
  }

  static create(data: ProductCategoryRefData) {
    return new ProductCategoryRef(data);
  }

  static readonly DEFAULT = Object.freeze(
    ProductCategoryRef.create({
      id : 0,
      name: "Hjem",
    }) as ProductCategoryRef);
};

