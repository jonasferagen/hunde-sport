import { VariationSelection } from "@/domain/product/helpers/VariationSelection";
import { Product } from "@/domain/product/Product"; // still exposes .create
import type { ProductVariation, SimpleProduct, VariableProduct } from "@/types";

export function makeSimple(id = 1, name = "S"): SimpleProduct {
  return Product.create({
    type: "simple",
    id,
    name,
    prices: {} as any,
    is_in_stock: true,
    is_purchasable: true,
    slug: "s",
    permalink: "#",
    description: "",
    categories: [],
    parent: 0,
    images: [],
  } as any) as SimpleProduct;
}

export function makeVariable(
  attrs: Record<string, string>,
  id = 2,
  name = "V"
): VariableProduct {
  return Product.create({
    type: "variable",
    id,
    name,
    prices: {} as any,
    is_in_stock: true,
    is_purchasable: true,
    slug: "v",
    permalink: "#",
    description: "",
    categories: [],
    parent: 0,
    images: [],
    attributes: Object.entries(attrs).map(([key, label]) => ({
      id: 0,
      name: label,
      slug: key,
      variation: true,
      visible: true,
      options: [], // or your real shape
    })),
    variations: [], // fill in your fixtures as needed
  } as any) as VariableProduct;
}

export function fakeVariation(id = 42): ProductVariation {
  return { id } as unknown as ProductVariation;
}

export function selectAll(vp: VariableProduct, init: Record<string, string>) {
  return new VariationSelection(vp, new Map(Object.entries(init)));
}
