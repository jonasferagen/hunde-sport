/** ---- Mapper(s) ---- */

import { ProductCategory } from "@/domain/ProductCategory";
import { StoreImage, StoreImageData } from "@/domain/StoreImage";

// Minimal Store API shape we care about. `image` can be null/undefined.
type StoreCategoryInput = {
  id: number;
  name: string;
  parent: number;
  image?: StoreImageData | null;
  description?: string | null;
  slug: string;
};

/** Single item */
export const mapToProductCategory = (
  item: StoreCategoryInput
): ProductCategory =>
  new ProductCategory({
    id: item.id,
    name: item.name,
    parent: item.parent,
    image: item.image ? new StoreImage(item.image) : StoreImage.DEFAULT,
    description: item.description ?? "",
    slug: item.slug,
  });
