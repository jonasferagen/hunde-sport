
import type { ProductVariation } from "@/domain/product/ProductVariation";
import type { SimpleProduct } from "@/domain/product/SimpleProduct";
import type { VariableProduct } from "@/domain/product/VariableProduct";

export * from "@/domain/product/Product";
export * from "@/domain/product/ProductVariation";
export * from "@/domain/product/SimpleProduct";
export * from "@/domain/product/VariableProduct";
export * from "@/domain/ProductCategory";
export * from "@/domain/Purchasable";
export * from "@/lib/types";

export type Product = SimpleProduct | VariableProduct | ProductVariation;
