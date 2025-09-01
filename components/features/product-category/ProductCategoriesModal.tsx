import { ChevronRight } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
import { H4 } from "tamagui";

import { ThemedButton } from "@/components/ui";
import { ModalLayout } from "@/components/ui/ModalLayout";
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
    <ModalLayout
      title={title}
      onClose={close}
      scroll={false} // Body is a FlatList (its own scroller)
    >
      <FlatList
        data={productCategories}
        keyExtractor={(c) => String(c.id)}
        renderItem={({ item, index }) => (
          <ThemedButton
            w="100%"
            justifyContent="space-between"
            size="$5"
            mt={index > 0 ? "$2" : undefined}
            onPress={() => {
              to("product-category", item);
              close(); // close on select
            }}
          >
            <H4>{item.name}</H4>
            <ChevronRight />
          </ThemedButton>
        )}
      />
    </ModalLayout>
  );
}
