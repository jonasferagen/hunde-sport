// components/product/ProductPrice.tsx
import { StarFull } from "@tamagui/lucide-icons";
import React from "react";

import {
  ThemedText,
  type ThemedTextProps,
  ThemedXStack,
} from "@/components/ui/themed";
import { InlineSpinnerSwap } from "@/components/widgets/InlineSpinnerSwap";
import { PriceBook } from "@/domain/pricing/PriceBook";
import type { ProductVariation } from "@/domain/product";
import { useProductPriceRange } from "@/hooks/useProductPriceRange";
import type { Product, VariableProduct } from "@/types";

// Narrowed prop for text sizing only
type ThemedTextSize = ThemedTextProps["size"];

// PriceLine.tsx
type PriceLineProps = React.PropsWithChildren<{
  showIcon?: boolean;
  beforePrice?: React.ReactNode;
  size?: ThemedTextSize;
  loading?: boolean;
}>;

const PriceLine = ({
  showIcon,
  beforePrice,
  size,
  loading,
  children,
}: PriceLineProps) => (
  <ThemedXStack ai="center" gap="$2" pos="relative" animation="fast" fade>
    {showIcon ? <StarFull scale={0.5} color="gold" /> : null}

    {beforePrice ? (
      <ThemedText disabled size={size}>
        {beforePrice}
      </ThemedText>
    ) : null}

    <InlineSpinnerSwap loading={!!loading} textProps={{ size, tabular: true }}>
      {children ?? "00,-"}
    </InlineSpinnerSwap>
  </ThemedXStack>
);

type ProductPriceFromProductProps = {
  product: Product;
  showIcon?: boolean;
  size?: ThemedTextSize;
};

type ProductPriceFromVariationsProps = {
  productVariations: ProductVariation[]; // 1 => exact price, >1 => range, 0 => null
  showIcon?: boolean;
  size?: ThemedTextSize;
};

type ProductPriceProps =
  | ProductPriceFromProductProps
  | ProductPriceFromVariationsProps;

export const ProductPrice = React.memo(function ProductPrice(
  props: ProductPriceProps,
) {
  // --- Variations array path ---
  if ("productVariations" in props) {
    const { productVariations, showIcon = false, size } = props;
    const { length } = productVariations ?? [];

    if (!length) return null;

    if (length === 1) {
      return (
        <ProductPrice
          product={productVariations[0] as Product}
          showIcon={showIcon}
          size={size}
        />
      );
    }

    const productPriceRange = PriceBook.getProductPriceRange(
      productVariations.map((productVariation) => productVariation.priceBook),
    );

    // Price range (no sale prefix here)
    return (
      <PriceLine size={size}>
        {PriceBook.fmtPriceRange(productPriceRange)}
      </PriceLine>
    );
  }

  // --- Single product path ---
  const { product, showIcon = false, size } = props;

  if (product.isVariable) {
    return (
      <ProductPriceVariable
        variableProduct={product as VariableProduct}
        size={size}
      />
    );
    // Note: icon behavior for variable range unchanged (no icon by default).
  }

  // Simple product with PriceBook driving flags/format
  const { priceBook } = product;

  return (
    <PriceLine
      showIcon={showIcon && (priceBook.isFree || priceBook.isOnSale)}
      beforePrice={priceBook.isOnSale ? priceBook.fmtRegular() : undefined}
      size={size}
    >
      {priceBook.isOnSale ? priceBook.fmtSale() : priceBook.fmtPrice()}
    </PriceLine>
  );
});

function ProductPriceVariable({
  variableProduct,
  size,
}: {
  variableProduct: VariableProduct;
  size?: ThemedTextSize;
}) {
  const { productPriceRange, isLoading } =
    useProductPriceRange(variableProduct);

  const text = productPriceRange
    ? PriceBook.fmtPriceRange(productPriceRange)
    : "Kommer";

  return (
    <PriceLine size={size} loading={isLoading}>
      {!isLoading ? text : undefined}
    </PriceLine>
  );
}
