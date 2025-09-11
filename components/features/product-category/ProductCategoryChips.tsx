import React from "react";

import { Chip } from "@/components/ui/chips/Chip";
import { ThemedXStack } from "@/components/ui/themed-components";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import { type ProductCategoryRef, ProductCategory } from "@/types";

export const ProductCategoryChips = React.memo(function ProductCategoryChips({
  categoryRefs,
}: {
  categoryRefs: ProductCategoryRef[];
}) {
  const { to } = useCanonicalNavigation();
  return (
    <ThemedXStack fw="wrap" gap="$2">
      {categoryRefs.map((categoryRef) => (
        <ThemedXStack
          key={categoryRef.id}
          onPress={() =>
            to("product-category", categoryRef as unknown as ProductCategory)
          }
        >
          <Chip theme="shade">{categoryRef.name}</Chip>
        </ThemedXStack>
      ))}
    </ThemedXStack>
  );
});
