import * as React from "react";
import { Paragraph } from "tamagui";

import { PurchaseButton } from "@/components/features/product/purchase/PurchaseButton";
import { ThemedYStack } from "@/components/ui";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { CustomField } from "@/domain/CustomField";
import { Purchasable } from "@/types";

import { ProductCustomizationForm } from "./ProductCustomizationForm";

type Props = {
  purchasable: Purchasable;
  close: () => void;
};

export const ProductCustomizationModal = ({ close, purchasable }: Props) => {
  return (
    <ProductCustomizationModalContent close={close} purchasable={purchasable} />
  );
};

export const ProductCustomizationModalContent = ({
  close,
  purchasable,
}: {
  close: () => void;
  purchasable: Purchasable;
}) => {
  const {
    product,
    attributeSelection,
    productVariation,
    customFields: initialCustomFields,
  } = purchasable;

  const [customFields, setCustomFields] = React.useState<CustomField[]>(
    initialCustomFields ?? product.customFields ?? []
  );

  const newPurchasable = React.useMemo(
    () =>
      Purchasable.create({
        customFields,
        product,
        attributeSelection,
        productVariation,
      }),
    [product, attributeSelection, productVariation, customFields]
  );

  return (
    <ModalLayout
      title={product.name}
      onClose={close}
      footer={
        <ThemedYStack>
          <ThemedYStack mb="$3" />
          <PurchaseButton purchasable={newPurchasable} onSuccess={close} />
        </ThemedYStack>
      }
    >
      <ThemedYStack gap="$3">
        <Paragraph>{product.short_description}</Paragraph>
        <ProductCustomizationForm
          fields={customFields}
          onChange={setCustomFields}
        />
      </ThemedYStack>
    </ModalLayout>
  );
};
