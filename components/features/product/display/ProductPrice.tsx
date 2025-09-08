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
import { PriceBook } from "@domain/pricing/PriceBook";
const PriceLine = ({
  showIcon,
  children,
}: React.PropsWithChildren<{ showIcon?: boolean }>) => (
  <ThemedXStack ai="center" gap="$1" pos="relative">
    {showIcon ? <StarFull scale={0.5} color="gold" /> : null}
    <ThemedText>{children}</ThemedText>
  </ThemedXStack>
);

type ProductPriceSimpleProps = { showIcon?: boolean } & ThemedTextProps;

export const ProductPrice = React.memo(function ProductPrice({
  showIcon = false,
  ...textProps
}: ProductPriceSimpleProps) {
  const { product, productPriceRange } = useProductContext();
  const { prices, availability } = product;
  const { isInStock, isPurchasable, isOnSale } = availability;

  const book = React.useMemo(() => PriceBook.from(prices), [prices]);

  // Variable products: prefer externally computed range if present
  if (product.isVariable) {
    if (productPriceRange) {
      return (
        <ProductPriceRange
          productPriceRange={productPriceRange}
          {...textProps}
        />
      );
    }
    return (
      <PriceLine>
        <ThemedSpinner scale={0.7} />
      </PriceLine>
    );
  }

  const saleValid = book.isSaleValid(isOnSale);
  const isFree = isInStock && book.price.minor === 0;
  const subtle = !isInStock || !isPurchasable || textProps.subtle;

  if (saleValid) {
    return (
      <PriceLine showIcon={showIcon}>
        <ThemedText disabled subtle {...textProps}>
          {book.fmtRegular()}
        </ThemedText>
        <ThemedText {...textProps} subtle={subtle}>
          {book.fmtSale()}
        </ThemedText>
      </PriceLine>
    );
  }

  const label = isFree ? "Gratis!" : book.fmtPrice();
  return (
    <PriceLine showIcon={showIcon && (isFree || isOnSale)}>
      <ThemedText {...textProps} subtle={subtle}>
        {label}
      </ThemedText>
    </PriceLine>
  );
});

// Keep your server-driven range renderer (best for variable products)
import type { ProductPriceRange as TProductPriceRange } from "@/domain/pricing/types";

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
  const same = (min?.price ?? "0") === (max?.price ?? "0");
  const minLabel = PriceBook.from(min).fmtPrice();
  const label = same
    ? minLabel
    : short
      ? `Fra ${minLabel}`
      : `${minLabel} – ${PriceBook.from(max).fmtPrice()}`;

  return (
    <PriceLine showIcon={showIcon}>
      <ThemedText {...textProps}>{label}</ThemedText>
    </PriceLine>
  );
});
