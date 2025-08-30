// Re-export models

import { ProductVariation } from "@/domain/Product/ProductVariation";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { VariableProduct } from "@/domain/Product/VariableProduct";

export * from "@/domain/pricing";
export * from "@/domain/Product/Product";
export * from "@/domain/Product/ProductVariation";
export * from "@/domain/Product/SimpleProduct";
export * from "@/domain/Product/VariableProduct";
export * from "@/domain/ProductCategory";
export * from "@/domain/Purchasable";

export type PurchasableProduct = VariableProduct | SimpleProduct;
export type Product = PurchasableProduct | ProductVariation;
