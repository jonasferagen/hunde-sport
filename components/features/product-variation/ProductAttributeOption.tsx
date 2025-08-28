import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";

import { ProductPriceRange } from "../product/display/ProductPrice";

export const ProductAttributeOption = ({
  attribute,
  term,
  isSelected,
  enabled,
  label,
  onPress,
  price,
}: {
  attribute: string;
  term: string;
  isSelected: boolean;
  enabled: boolean;
  label: string;
  onPress: () => void;
  price?: any;
}) => {
  return (
    <ThemedXStack
      key={`${attribute}:${term}`}
      ai="center"
      gap="$2"
      theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}
    >
      <ThemedButton
        size="$4"
        bw={2}
        aria-label={label}
        onPress={onPress}
        disabled={!enabled}
      >
        <ThemedXStack f={1} split>
          <ThemedXStack gap="$1">
            <ThemedText>{label}</ThemedText>
          </ThemedXStack>
          {price ? <ProductPriceRange productPriceRange={price} /> : null}
        </ThemedXStack>
      </ThemedButton>
    </ThemedXStack>
  );
};
