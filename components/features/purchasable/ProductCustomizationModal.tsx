import * as React from "react";

import { PurchaseButton } from "@/components/features/product/purchase/PurchaseButton";
import { ThemedYStack } from "@/components/ui";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { CustomField } from "@/domain/extensions/CustomField";
import { Purchasable } from "@/types";

import { ProductImage, ProductTitle } from "../product/display";
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

  const IMAGE_H = 200;

  return (
    <ModalLayout
      title={<ProductTitle product={product} fs={1} />}
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
      <ThemedYStack w="100%" h={IMAGE_H} mb="$3">
        <ProductImage product={product} img_height={IMAGE_H} />
      </ThemedYStack>

      <ProductCustomizationForm fields={fields} onChange={setFields} />
    </ModalLayout>
  );
};
