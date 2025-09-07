// components/product/ProductPrice.tsx
import { StarFull } from "@tamagui/lucide-icons";
import React from "react";

import {
  ThemedSpinner,
  ThemedText,
  type ThemedTextProps,
  ThemedXStack,
} from "@/components/ui/themed-components";
import { useProductContext } from "@/contexts/ProductContext";
import { formatPrice } from "@/domain/pricing/format";
import type { ProductPriceRange as TProductPriceRange } from "@/domain/pricing/types";

const PriceLine = ({
  showIcon,
  children,
}: React.PropsWithChildren<{ showIcon?: boolean }>) => (
  <ThemedXStack ai="center" gap="$1" pos="relative">
    {showIcon ? <StarFull scale={0.5} color="gold" /> : null}
    <ThemedText>{children}</ThemedText>
  </ThemedXStack>
);

// ----- Simple price renderer (no data fetching) -----
type ProductPriceSimpleProps = {
  showIcon?: boolean;
} & ThemedTextProps;

export const ProductPrice = React.memo(function ProductPrice({
  showIcon = false,
  ...textProps
}: ProductPriceSimpleProps) {
  const { product, productVariationPrices, isLoading } = useProductContext();
  const { prices, availability } = product;
  const { isInStock, isPurchasable, isOnSale } = availability;

  const saleValid = React.useMemo(() => {
    const saleVal = parseInt(prices?.sale_price ?? "0", 10);
    const regVal = parseInt(prices?.regular_price ?? "0", 10);
    return isOnSale && saleVal > 0 && regVal > 0 && saleVal < regVal;
  }, [prices, isOnSale]);

  const isFree = isInStock && prices?.price === "0";
  const subtle = !isInStock || !isPurchasable || textProps.subtle;

  if (product.isVariable) {
    if (isLoading) {
      return <ThemedSpinner />;
    }
    const range = {
      min: productVariationPrices[0]!,
      max: productVariationPrices[productVariationPrices.length - 1]!,
    };
    return <ProductPriceRange productPriceRange={range} {...textProps} />;
  }

  if (saleValid) {
    return (
      <PriceLine showIcon={showIcon}>
        <ThemedText disabled subtle {...textProps}>
          {formatPrice(prices, { field: "regular_price" })}
        </ThemedText>
        <ThemedText {...textProps} subtle={subtle}>
          {formatPrice(prices, { field: "sale_price" })}
        </ThemedText>
      </PriceLine>
    );
  }

  const label = isFree ? "Gratis!" : formatPrice(prices, { field: "price" });
  return (
    <PriceLine showIcon={showIcon && (isFree || isOnSale)}>
      <ThemedText {...textProps} subtle={subtle}>
        {label}
      </ThemedText>
    </PriceLine>
  );
});

// ----- Price range renderer (min–max only, no sale logic) -----
type ProductPriceRangeProps = {
  productPriceRange: TProductPriceRange;
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
  const minVal = parseInt(min?.price ?? "0", 10);
  const maxVal = parseInt(max?.price ?? "0", 10);
  const label =
    minVal === maxVal
      ? formatPrice(min, { field: "price" })
      : short
        ? `Fra ${formatPrice(min, { field: "price" })}`
        : `${formatPrice(min, { field: "price" })} – ${formatPrice(max, { field: "price" })}`;

  return (
    <PriceLine showIcon={showIcon}>
      <ThemedText {...textProps}>{label}</ThemedText>
    </PriceLine>
  );
});
