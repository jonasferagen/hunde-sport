// domain/purchasable/decidePurchasable.ts
import type { ThemeName } from "tamagui";

import type { Purchasable, PurchasableStatus } from "./Purchasable";

export type DecisionNext =
  | "addToCart"
  | "openVariations"
  | "openCustomize"
  | "noop";

export type Decision = {
  next: DecisionNext;
  disabled: boolean;
  iconKey: string;
  theme: ThemeName;
  label: string;
};

type ConfigEntry = {
  iconKey: string;
  theme: ThemeName;
  next?: DecisionNext; // defaults to "noop"
  disabled?: boolean; // defaults to false
};

// Strongly-typed config (no runtime undefined)
const CONFIG: Record<PurchasableStatus, ConfigEntry> = {
  ready: {
    iconKey: "ShoppingCart",
    theme: "cta.buy" as ThemeName,
    next: "addToCart",
  },
  select: {
    iconKey: "Boxes",
    theme: "cta.view" as ThemeName,
    next: "openVariations",
  },
  select_incomplete: {
    iconKey: "TriangleAlert",
    theme: "cta.select" as ThemeName,
    disabled: true,
  },
  customize: {
    iconKey: "Brush",
    theme: "cta.view" as ThemeName,
    next: "openCustomize",
  },
  customize_incomplete: {
    iconKey: "TriangleAlert",
    theme: "cta.select" as ThemeName,
    disabled: true,
  },
  sold_out: {
    iconKey: "CircleAlert",
    theme: "cta.oos" as ThemeName,
    disabled: true,
  },
  unavailable: {
    iconKey: "XCircle",
    theme: "cta.unavailable" as ThemeName,
    disabled: true,
  },
};

export function decidePurchasable(purchasable: Purchasable): Decision {
  const { key, label } = purchasable.status;
  const entry = CONFIG[key]; // key is PurchasableStatus → always present
  return {
    next: entry.next ?? "noop",
    disabled: entry.disabled ?? false,
    iconKey: entry.iconKey,
    theme: entry.theme,
    label,
  };
}
