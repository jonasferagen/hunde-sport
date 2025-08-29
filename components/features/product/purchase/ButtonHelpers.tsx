import {
  Boxes,
  CircleSlash,
  ShoppingCart,
  TriangleAlert,
  XCircle,
} from "@tamagui/lucide-icons";
import { JSX } from "react";
import { Theme, ThemeName } from "tamagui";

import { ThemedSurface } from "@/components/ui/themed-components/ThemedSurface";
import {
  THEME_CTA_BUY,
  THEME_CTA_OUTOFSTOCK,
  THEME_CTA_SELECTION_NEEDED,
  THEME_CTA_UNAVAILABLE,
  THEME_CTA_VIEW,
} from "@/config/app";
import { ProductAvailability, ProductPrices, Purchasable } from "@/types";

import { ProductPrice } from "../display";

export const PriceTag = ({
  productPrices,
  productAvailability,
}: {
  productPrices: ProductPrices;
  productAvailability: ProductAvailability;
}) => (
  <Theme inverse>
    <ThemedSurface
      theme="shade"
      h="$6"
      ai="center"
      jc="center"
      px="none"
      mr={-20}
      minWidth={80}
    >
      <ProductPrice
        productPrices={productPrices}
        productAvailability={productAvailability}
      />
    </ThemedSurface>
  </Theme>
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

export const resolveStatus = ({
  availability,
  purchasable,
}: {
  availability: ProductAvailability;
  purchasable?: Purchasable;
}) => {
  if (!availability.isInStock) {
    return STATUS.outofstock;
  }
  if (!availability.isPurchasable) {
    return STATUS.unavailable;
  }

  if (purchasable) {
    const { status, message } = purchasable;
    if (status === "selection_needed") {
      const res = STATUS.selection_needed;
      res.label = message;
      return res;
    }
  }

  return STATUS.buy;
};

// actions

// statuses
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
    icon: <CircleSlash />,
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
