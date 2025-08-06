import { ProductVariation } from "./ProductVariation";
import { SimpleProduct } from "./SimpleProduct";
import { VariableProduct } from "./VariableProduct";

export type Product = SimpleProduct | VariableProduct | ProductVariation;

export type PurchasableProduct = SimpleProduct | VariableProduct;

export type Purchasable =
    | {
        product: SimpleProduct;
        productVariation?: undefined;
    }
    | {
        product: VariableProduct;
        productVariation: ProductVariation;
    };
