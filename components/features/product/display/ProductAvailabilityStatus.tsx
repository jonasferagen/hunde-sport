import { ThemedText, ThemedXStack } from "@/components/ui/themed-components";
import type { ProductAvailability } from "@/types";

interface Props {
  productAvailability: ProductAvailability;
  showInStock?: boolean;
  short?: boolean;
}

export const ProductAvailabilityStatus = ({
  productAvailability,
  showInStock = true,
  short = false,
}: Props) => {
  const { isInStock, isOnBackOrder } = productAvailability;

  const green = "green";
  const yellow = "yellow";
  const red = "red";

  const color = isInStock ? green : isOnBackOrder ? yellow : red;
  const text = isInStock ? "På lager" : isOnBackOrder ? "På vei" : "Utsolgt";

  return showInStock || !isInStock ? (
    <ThemedXStack gap="$2" ai="center">
      <ThemedText col={color}>⬤</ThemedText>
      {short ? null : <ThemedText>{text}</ThemedText>}
    </ThemedXStack>
  ) : null;
};
