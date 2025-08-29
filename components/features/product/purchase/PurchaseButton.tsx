import React from "react";

import { ProductVariationsModal } from "@/components/features/product-variation/ProductVariationsModal";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import {
  useAddToCartPurchasable,
  useAddToCartSimple,
} from "@/hooks/useAddToCart";
import { openModal } from "@/stores/ui/modalStore";
import type { Purchasable, SimpleProduct, VariableProduct } from "@/types";

import { PriceTag, resolveStatus } from "./ButtonHelpers";

type Props = {
  product: SimpleProduct | VariableProduct;
  /** Provide when product is variable and user has an active selection */
  purchasable?: Purchasable;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
};

const isVariable = (p: SimpleProduct | VariableProduct): p is VariableProduct =>
  (p as any).type === "variable" || (p as any).isVariable === true;

const isSimple = (p: SimpleProduct | VariableProduct): p is SimpleProduct =>
  (p as any).type === "simple" || !(p as any).isVariable;

export const PurchaseButton = React.memo(function PurchaseButton({
  product,
  purchasable,
  onSuccess,
  onError,
}: Props) {
  if (isSimple(product)) return <SimpleInner product={product} />;

  if (isVariable(product)) {
    if (purchasable) {
      return (
        <PurchasableInner
          purchasable={purchasable}
          onSuccess={onSuccess}
          onError={onError}
        />
      );
    }
    return <VariableInner product={product} />;
  }

  // Fallback (shouldn't happen if your domain types are correct)
  return null;
});

/** ---- Internals: keep hooks unconditional ---- */

const SimpleInner = React.memo(function SimpleInner({
  product,
}: {
  product: SimpleProduct;
}) {
  const { isLoading, onPress } = useAddToCartSimple(product);
  const { theme, icon, label, disabled } = resolveStatus(product);

  return (
    <CallToActionButton
      onPress={onPress}
      before={icon}
      theme={theme}
      label={label}
      after={
        <PriceTag prices={product.prices} availability={product.availability} />
      }
      loading={isLoading}
      disabled={disabled}
    />
  );
});

const VariableInner = React.memo(function VariableInner({
  product,
}: {
  product: VariableProduct;
}) {
  const onPress = () =>
    openModal(
      (_, api) => (
        <ProductVariationsModal
          variableProduct={product}
          close={() => api.close()}
        />
      ),
      product
    );

  const { theme, icon, label, disabled } = resolveStatus(product);

  return (
    <CallToActionButton
      onPress={onPress}
      before={icon}
      theme={theme}
      label={label}
      after={
        <PriceTag prices={product.prices} availability={product.availability} />
      }
      loading={false}
      disabled={disabled}
    />
  );
});

const PurchasableInner = React.memo(function PurchasableInner({
  purchasable,
  onSuccess,
  onError,
}: {
  purchasable: Purchasable;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}) {
  const product = purchasable.variableProduct;
  const { isLoading, onPress } = useAddToCartPurchasable(purchasable, {
    onSuccess,
    onError,
  });
  const { theme, icon, label, disabled } = resolveStatus(product, purchasable);

  return (
    <CallToActionButton
      onPress={onPress}
      before={icon}
      theme={theme}
      label={label}
      after={
        <PriceTag prices={product.prices} availability={product.availability} />
      }
      loading={isLoading}
      disabled={disabled}
    />
  );
});
