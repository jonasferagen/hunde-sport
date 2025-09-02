import type { SizableTextProps } from "tamagui";

import { ThemedText } from "@/components/ui";
import type { PurchasableProduct } from "@/types";

interface ProductDescriptionProps extends SizableTextProps {
  long?: boolean;
  product: PurchasableProduct;
}

export const ProductDescription = ({
  long = false,
  product,
  ...sizableTextProps
}: ProductDescriptionProps) => {
  const description = long
    ? product.description || product.short_description
    : product.short_description;

  return (
    <ThemedText
      fos="$2"
      lh="$1"
      textDecorationLine="none"
      {...sizableTextProps}
    >
      {description || "Ingen beskrivelse tilgjengelig"}
    </ThemedText>
  );
};
