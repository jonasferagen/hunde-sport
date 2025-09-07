import * as React from "react";
import { Paragraph } from "tamagui";

import { PurchaseButton } from "@/components/features/product/purchase/PurchaseButton";
import { ThemedYStack } from "@/components/ui";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { ProductProvider } from "@/contexts";
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
  return (
    <ProductProvider product={purchasable.product}>
      <ProductCustomizationModalContent
        close={close}
        purchasable={purchasable}
      />
    </ProductProvider>
  );
};

export const ProductCustomizationModalContent = ({
  close,
  purchasable,
}: {
  close: () => void;
  purchasable: Purchasable;
}) => {
  const { product, attributeSelection, productVariation } = purchasable;

  const [fields, setFields] = React.useState<CustomField[]>(
    product.customFields ?? []
  );

  const newPurchasable = React.useMemo(
    () =>
      Purchasable.create({
        product,
        attributeSelection,
        productVariation,
      }),
    [product, attributeSelection, productVariation]
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
        <ProductCustomizationForm fields={fields} onChange={setFields} />
      </ThemedYStack>
    </ModalLayout>
  );
};
