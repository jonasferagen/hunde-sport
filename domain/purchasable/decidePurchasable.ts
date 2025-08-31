export type PurchasableStatus =
  | "ready"
  | "select"
  | "select_incomplete"
  | "customize"
  | "customize_incomplete"
  | "sold_out"
  | "unavailable";

export type Decision =
  | {
      next: "addToCart";
      label: string;
      disabled: boolean;
      iconKey: string;
      theme: string;
    }
  | {
      next: "openVariations";
      label: string;
      disabled: boolean;
      iconKey: string;
      theme: string;
    }
  | {
      next: "openCustomize";
      label: string;
      disabled: boolean;
      iconKey: string;
      theme: string;
    }
  | {
      next: "noop";
      label: string;
      disabled: boolean;
      iconKey: string;
      theme: string;
    };

// Keep UI config here but as *names*, not JSX
export type UIConf = { iconKey: string; theme: string };
export type UIByStatus = Record<PurchasableStatus, UIConf>;

export function decidePurchasable(
  statusKey: PurchasableStatus,
  labelFromStatus: string,
  ui: UIByStatus
): Decision {
  const { iconKey, theme } = ui[statusKey];

  switch (statusKey) {
    case "ready":
      return {
        next: "addToCart",
        label: labelFromStatus,
        disabled: false,
        iconKey,
        theme,
      };
    case "select":
      return {
        next: "openVariations",
        label: labelFromStatus,
        disabled: false,
        iconKey,
        theme,
      };
    case "customize":
      return {
        next: "openCustomize",
        label: labelFromStatus,
        disabled: false,
        iconKey,
        theme,
      };
    case "select_incomplete":
    case "customize_incomplete":
    case "sold_out":
    case "unavailable":
      return {
        next: "noop",
        label: labelFromStatus,
        disabled: true,
        iconKey,
        theme,
      };
  }
}
