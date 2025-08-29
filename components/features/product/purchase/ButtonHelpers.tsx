import {
  Boxes,
  CircleAlert,
  ShoppingCart,
  TriangleAlert,
  XCircle,
} from "@tamagui/lucide-icons";
import type { JSX } from "react";
import type { ThemeName } from "tamagui";

import { ThemedSurface } from "@/components/ui/themed-components/ThemedSurface";
import {
  THEME_CTA_BUY,
  THEME_CTA_OUTOFSTOCK,
  THEME_CTA_SELECTION_NEEDED,
  THEME_CTA_UNAVAILABLE,
  THEME_CTA_VIEW,
} from "@/config/app";
import type {
  ProductAvailability,
  ProductPrices,
  Purchasable,
  SimpleProduct,
  VariableProduct,
} from "@/types";

import { ProductPrice } from "../display";

export const PriceTag = ({
  prices,
  availability,
}: {
  prices: ProductPrices;
  availability: ProductAvailability;
}) => (
  <ThemedSurface
    theme="shade"
    h="$6"
    ai="center"
    jc="center"
    px="none"
    mr={-20}
    minWidth={80}
  >
    <ProductPrice productPrices={prices} productAvailability={availability} />
  </ThemedSurface>
);

export type Status =
  | "buy"
  | "list"
  | "selection_needed"
  | "outofstock"
  | "unavailable";
export type UIConf = {
  icon: JSX.Element;
  theme: ThemeName;
  label: string;
  disabled: boolean;
};

export const STATUS: Record<Status, UIConf> = {
  buy: {
    icon: <ShoppingCart />,
    theme: THEME_CTA_BUY,
    label: "Kjøp",
    disabled: false,
  },
  list: {
    icon: <Boxes />,
    theme: THEME_CTA_VIEW,
    label: "Se varianter",
    disabled: false,
  },
  selection_needed: {
    icon: <TriangleAlert />,
    theme: THEME_CTA_SELECTION_NEEDED,
    label: "Velg ...",
    disabled: true,
  },
  outofstock: {
    icon: <CircleAlert />,
    theme: THEME_CTA_OUTOFSTOCK,
    label: "Utsolgt",
    disabled: true,
  },
  unavailable: {
    icon: <XCircle />,
    theme: THEME_CTA_UNAVAILABLE,
    label: "Ikke tilgjengelig",
    disabled: true,
  },
};

export const resolveStatus = (
  product: SimpleProduct | VariableProduct,
  purchasable?: Purchasable
): UIConf => {
  const { availability } = product;

  if (!availability.isInStock) return STATUS.outofstock;
  if (!availability.isPurchasable) return STATUS.unavailable;

  if ((product as any).isVariable && !purchasable) return STATUS.list;

  if (purchasable) {
    if (purchasable.selectedVariation) return STATUS.buy;
    const res = { ...STATUS.selection_needed };
    res.label = purchasable.message || res.label;
    return res;
  }

  return STATUS.buy;
};
