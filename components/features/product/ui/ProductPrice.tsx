// components/product/ProductPrice.tsx
import { StarFull } from "@tamagui/lucide-icons";
import React from "react";

import {
  ThemedSpinner,
  ThemedText,
  type ThemedTextProps,
  ThemedXStack,
} from "@/components/ui/themed";
import { PriceBook } from "@/domain/pricing/PriceBook";
import type { ProductPriceRange as ProductPriceRangeType } from "@/domain/pricing/types";
import { useProductPriceRange } from "@/hooks/useProductPriceRange";
import type { Product, VariableProduct } from "@/types";

const PriceLine = ({
  showIcon,
  children,
}: React.PropsWithChildren<{ showIcon?: boolean }>) => (
  <ThemedXStack ai="center" gap="$1" pos="relative">
    {showIcon ? <StarFull scale={0.5} color="gold" /> : null}
    <ThemedText>{children}</ThemedText>
  </ThemedXStack>
);

type ProductPriceSimpleProps = {
  product: Product;
  showIcon?: boolean;
} & ThemedTextProps;

export const ProductPrice = React.memo(function ProductPrice({
  showIcon = false,
  product,
  ...textProps
}: ProductPriceSimpleProps) {
  const { availability } = product;
  const { isInStock, isPurchasable, isOnSale } = availability;
  const priceBook: PriceBook = product.priceBook;
  if (product.isVariable) {
    return (
      <ProductPriceVariable
        variableProduct={product as VariableProduct}
        {...textProps}
      />
    );
  }

  const isFree = isInStock && priceBook.price.minor === 0;
  const subtle = Boolean(!isInStock || !isPurchasable || textProps.subtle);

  if (isOnSale) {
    return (
      <PriceLine showIcon={showIcon}>
        <ThemedXStack gap="$2">
          <ThemedText disabled {...textProps}>
            {priceBook.fmtRegular()}
          </ThemedText>
          <ThemedText {...textProps} subtle={subtle}>
            {priceBook.fmtSale()}
          </ThemedText>
        </ThemedXStack>
      </PriceLine>
    );
  }

  const label = isFree
    ? isPurchasable
      ? "Gratis!"
      : "Ta kontakt"
    : priceBook.fmtPrice();
  return (
    <PriceLine showIcon={showIcon && (isFree || isOnSale)}>
      <ThemedText {...textProps} subtle={subtle}>
        {label}
      </ThemedText>
    </PriceLine>
  );
});

type ProductPriceRangeProps = {
  productPriceRange: ProductPriceRangeType;
  showIcon?: boolean;
  short?: boolean;
} & ThemedTextProps;

export const ProductPriceRange = React.memo(function ProductPriceRangeCmp({
  productPriceRange,
  showIcon = false,
  short = true,
  ...textProps
}: ProductPriceRangeProps) {
  const { min, max } = productPriceRange;
  const same = PriceBook.isEqual(min, max);
  const minLabel = min.fmtPrice();
  const label = same
    ? minLabel
    : short
      ? `Fra ${minLabel}`
      : `${minLabel} – ${max.fmtPrice()}`;

  return (
    <PriceLine showIcon={showIcon}>
      <ThemedText {...textProps}>{label}</ThemedText>
    </PriceLine>
  );
});
/** Subcomponent that safely calls the hook (no conditional hook calls) */
function ProductPriceVariable({
  variableProduct,
  ...textProps
}: { variableProduct: VariableProduct } & ThemedTextProps) {
  const { productPriceRange, isLoading } =
    useProductPriceRange(variableProduct);

  if (isLoading) {
    return (
      <PriceLine>
        <ThemedSpinner scale={0.7} />
      </PriceLine>
    );
  }
  if (!productPriceRange) {
    return (
      <PriceLine>
        <ThemedText {...textProps}>Kommer</ThemedText>
      </PriceLine>
    );
  }

  return (
    <ProductPriceRange productPriceRange={productPriceRange} {...textProps} />
  );
}
