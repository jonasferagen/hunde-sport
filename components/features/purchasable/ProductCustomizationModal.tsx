// components/features/product-variation/ProductVariationsModal.tsx
import { X } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView } from "tamagui";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui";
import { CustomField } from "@/domain/extensions/CustomField";
import { Purchasable } from "@/types";

import { ProductImage, ProductTitle } from "../product/display";
import { PurchaseButton } from "../product/purchase/PurchaseButton";
import { ProductCustomizationForm } from "./ProductCustomizationForm";

type Props = {
  purchasable: Purchasable;
  close: () => void;
  initialValues?: CustomField[];
  onDone?: (customFields: CustomField[]) => void;
};

export const ProductCustomizationModal = ({ close, purchasable }: Props) => {
  const _purchasable = React.useMemo(
    () =>
      new Purchasable(
        purchasable.product,
        purchasable.variationSelection,
        purchasable.selectedVariation,
        { a: "b" }
      ),
    [purchasable]
  );

  return (
    <ProductCustomizationModalContent
      close={close}
      purchasable={_purchasable}
    />
  );
};

export const ProductCustomizationModalContent = ({
  close,
  purchasable,
}: {
  close: () => void;
  purchasable: Purchasable;
}) => {
  const product = purchasable.product; // variable here
  const [fields, setFields] = React.useState<CustomField[]>(
    product.customFields ?? []
  );

  // onDone -> pass `fields` upward; later use CustomField.toCartExtensionsFromFields(fields)

  const IMAGE_H = 200;
  return (
    <ThemedYStack f={1} mih={0} gap="$3">
      {/* Header */}
      <ThemedXStack split>
        <ProductTitle product={product} fs={1} />
        <ThemedText>{product.id}</ThemedText>
        <ThemedButton circular onPress={close}>
          <X />
        </ThemedButton>
      </ThemedXStack>

      {/* Image */}
      <ThemedYStack w="100%" h={IMAGE_H}>
        <ProductImage product={product} img_height={IMAGE_H} />
      </ThemedYStack>

      {/* Variations */}
      <ThemedYStack f={1} mih={0}>
        <ScrollView
          f={1}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          <ProductCustomizationForm fields={fields} onChange={setFields} />
        </ScrollView>
      </ThemedYStack>

      {/* Footer */}
      <ThemedYStack>
        <ThemedYStack mb="$3" />
        <PurchaseButton purchasable={purchasable} onSuccess={close} />
      </ThemedYStack>
    </ThemedYStack>
  );
};
