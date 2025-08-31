// Re-export models

import { ProductVariation } from "@/domain/product/ProductVariation";
import { SimpleProduct } from "@/domain/product/SimpleProduct";
import { VariableProduct } from "@/domain/product/VariableProduct";

export * from "@/domain/pricing";
export * from "@/domain/product-category/ProductCategory";
export * from "@/domain/product/Product";
export * from "@/domain/product/ProductVariation";
export * from "@/domain/product/SimpleProduct";
export * from "@/domain/product/VariableProduct";
export * from "@/domain/purchasable/Purchasable";

export type Product = SimpleProduct | VariableProduct | ProductVariation;
