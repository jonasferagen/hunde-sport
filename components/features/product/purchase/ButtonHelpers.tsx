import {
  Boxes,
  CircleSlash,
  FlagTriangleLeft,
  ShoppingCart,
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
import { ProductAvailability, ProductPrices } from "@/types";

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

// types
// types
export type Action = "buy" | "list";
export type Status = "selection_needed" | "outofstock" | "unavailable";

export type UIConf = {
  icon: JSX.Element;
  theme: ThemeName;
  label: string;
};

// actions
export const ACTIONS: Record<Action, UIConf> = {
  buy: { icon: <ShoppingCart />, theme: THEME_CTA_BUY, label: "Kjøp" },
  list: { icon: <Boxes />, theme: THEME_CTA_VIEW, label: "Se varianter" },
};

// statuses
export const STATUS: Record<Status, UIConf> = {
  selection_needed: {
    icon: <FlagTriangleLeft />,
    theme: THEME_CTA_SELECTION_NEEDED,
    label: "Velg ...",
  },
  outofstock: {
    icon: <CircleSlash />,
    theme: THEME_CTA_OUTOFSTOCK,
    label: "Utsolgt",
  },
  unavailable: {
    icon: <XCircle />,
    theme: THEME_CTA_UNAVAILABLE,
    label: "Ikke tilgjengelig",
  },
};
