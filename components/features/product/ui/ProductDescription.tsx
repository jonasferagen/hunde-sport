import type { SizableTextProps } from "tamagui";

import { ThemedParagraph } from "@/components/ui/themed/ThemedParagraph";
import type { PurchasableProduct } from "@/types";

interface ProductDescriptionProps extends SizableTextProps {
  long?: boolean;
  product: PurchasableProduct;
}

export const ProductDescription = ({
  long,
  product,
  ...sizableTextProps
}: ProductDescriptionProps) => {
  const description = long ? product.description : product.short_description;

  return (
    <ThemedParagraph
      fos="$2"
      lh="$1"
      textDecorationLine="none"
      {...sizableTextProps}
    >
      {description || "Ingen beskrivelse tilgjengelig"}
    </ThemedParagraph>
  );
};
