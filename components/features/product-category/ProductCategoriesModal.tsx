import { ChevronRight } from "@tamagui/lucide-icons";
import { H4 } from "tamagui";

import { ModalLayout } from "@/components/ui/ModalLayout";
import { ThemedButton, ThemedYStack } from "@/components/ui/themed";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import type { ProductCategory } from "@/types";

export function ProductCategoriesModal({
  productCategories,
  title,
  close,
}: {
  productCategories: readonly ProductCategory[];
  title: string;
  close: () => void;
}) {
  const { to } = useCanonicalNavigation();

  return (
    <ModalLayout title={title} onClose={close}>
      <ThemedYStack gap="$2">
        {productCategories.map((item) => (
          <ThemedButton
            key={item.id}
            w="100%"
            justifyContent="space-between"
            size="$5"
            onPress={() => {
              to("product-category", item);
              close();
            }}
            aria-label={`Open ${item.name}`}>
            <H4>{item.name}</H4>
            <ChevronRight />
          </ThemedButton>
        ))}
      </ThemedYStack>
    </ModalLayout>
  );
}
