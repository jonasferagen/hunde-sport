// features/purchase/ctaDecision.ts
import type { ThemeName } from "tamagui";

import {
  THEME_CTA_BUY,
  THEME_CTA_OUTOFSTOCK,
  THEME_CTA_SELECTION_NEEDED,
  THEME_CTA_UNAVAILABLE,
  THEME_CTA_VIEW,
} from "@/config/app";
import type { PurchasableStatus, StatusDescriptor } from "@/domain/Purchasable";

type DecisionNext = "addToCart" | "openVariations" | "openCustomize" | "noop";

type Decision = {
  next: DecisionNext;
  disabled: boolean;
  iconKey: string;
  theme: ThemeName;
  label: string;
};

type ConfigEntry = {
  iconKey: string;
  theme: ThemeName;
  next?: DecisionNext;
  disabled?: boolean;
};

const CONFIG: Record<PurchasableStatus, ConfigEntry> = {
  ready: { iconKey: "ShoppingCart", theme: THEME_CTA_BUY, next: "addToCart" },
  select: { iconKey: "Boxes", theme: THEME_CTA_VIEW, next: "openVariations" },
  select_incomplete: {
    iconKey: "TriangleAlert",
    theme: THEME_CTA_SELECTION_NEEDED,
    disabled: true,
  },
  customize: { iconKey: "Brush", theme: THEME_CTA_VIEW, next: "openCustomize" },
  customize_incomplete: {
    iconKey: "TriangleAlert",
    theme: THEME_CTA_SELECTION_NEEDED,
    disabled: true,
  },
  sold_out: {
    iconKey: "CircleAlert",
    theme: THEME_CTA_OUTOFSTOCK,
    disabled: true,
  },
  unavailable: {
    iconKey: "XCircle",
    theme: THEME_CTA_UNAVAILABLE,
    disabled: true,
  },
} as const satisfies Record<PurchasableStatus, ConfigEntry>;

export function decidePurchasable(status: StatusDescriptor): Decision {
  const { key, label } = status;
  const entry = CONFIG[key];
  return {
    next: entry.next ?? "noop",
    disabled: entry.disabled ?? false,
    iconKey: entry.iconKey,
    theme: entry.theme,
    label,
  };
}
