// components/product/ProductPrice.tsx
import { StarFull } from "@tamagui/lucide-icons";
import React from "react";

import {
  ThemedText,
  ThemedTextProps,
  ThemedXStack,
} from "@/components/ui/themed-components";
import { formatPrice } from "@/domain/pricing";
import {
  ProductAvailability,
  ProductPrices,
  ProductPriceRange as TProductPriceRange,
} from "@/types";

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
  productPrices: ProductPrices;
  productAvailability: ProductAvailability;
  showIcon?: boolean;
} & ThemedTextProps;

export const ProductPrice = React.memo(function ProductPrice({
  productPrices,
  productAvailability,
  showIcon = false,
  ...textProps
}: ProductPriceSimpleProps) {
  const { isInStock, isPurchasable, isOnSale } = productAvailability;

  const saleValid = React.useMemo(() => {
    const saleVal = parseInt(productPrices?.sale_price ?? "0", 10);
    const regVal = parseInt(productPrices?.regular_price ?? "0", 10);
    return isOnSale && saleVal > 0 && regVal > 0 && saleVal < regVal;
  }, [productPrices, isOnSale]);

  const isFree = isInStock && productPrices?.price === "0";
  const subtle = !isInStock || !isPurchasable || textProps.subtle;

  if (saleValid) {
    return (
      <PriceLine showIcon={showIcon}>
        <ThemedText disabled subtle {...textProps}>
          {formatPrice(productPrices, { field: "regular_price" })}
        </ThemedText>
        <ThemedText {...textProps} subtle={subtle}>
          {formatPrice(productPrices, { field: "sale_price" })}
        </ThemedText>
      </PriceLine>
    );
  }

  const label = isFree
    ? "Gratis!"
    : formatPrice(productPrices, { field: "price" });
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
