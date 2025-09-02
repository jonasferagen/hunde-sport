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
  initialValues?: CustomField[];
  onDone?: (customFields: CustomField[]) => void;
};

export const ProductCustomizationModal = ({ close, purchasable }: Props) => {
  const derived = React.useMemo(
    () =>
      new Purchasable(
        purchasable.product,
        purchasable.variationSelection,
        purchasable.selectedVariation,
        purchasable.customFields,
        true
      ),
    [purchasable]
  );
  return (
    <ProductCustomizationModalContent close={close} purchasable={derived} />
  );
};

export const ProductCustomizationModalContent = ({
  close,
  purchasable,
}: {
  close: () => void;
  purchasable: Purchasable;
}) => {
  const product = purchasable.product;
  const [fields, setFields] = React.useState<CustomField[]>(
    product.customFields ?? []
  );

  const effectivePurchasable = React.useMemo(
    () =>
      new Purchasable(
        purchasable.product,
        purchasable.variationSelection,
        purchasable.selectedVariation,
        fields,
        true
      ),
    [
      purchasable.product,
      purchasable.variationSelection,
      purchasable.selectedVariation,
      fields,
    ]
  );

  return (
    <ModalLayout
      title={product.name}
      onClose={close}
      footer={
        <ThemedYStack>
          <ThemedYStack mb="$3" />
          <PurchaseButton
            purchasable={effectivePurchasable}
            onSuccess={close}
          />
        </ThemedYStack>
      }
    >
      <ThemedYStack gap="$3">
        <Paragraph>{product.short_description}</Paragraph>
        <ProductCustomizationForm fields={fields} onChange={setFields} />
      </ThemedYStack>
    </ModalLayout>
  );
};
