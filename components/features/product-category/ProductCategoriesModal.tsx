import { ChevronRight } from "@tamagui/lucide-icons";

import { ModalLayout } from "@/components/ui/ModalLayout";
import {
  ThemedButton,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui/themed";
import { ThemedHeading } from "@/components/ui/themed/ThemedHeading";
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
            aria-label={`Open ${item.name}`}
          >
            <ThemedXStack f={1} split>
              <ThemedHeading>{item.name}</ThemedHeading>
              <ThemedHeading tabular>({item.count})</ThemedHeading>
            </ThemedXStack>
            <ChevronRight />
          </ThemedButton>
        ))}
      </ThemedYStack>
    </ModalLayout>
  );
}
