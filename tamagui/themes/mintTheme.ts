import { buildThemes } from "./themeFactory";

// theme-config.ts
export const config = {
  primary: { light: "#C8E6E5", dark: "#275554" },
  secondary: { light: "#DDE2C3", dark: "#474e25" },
  tertiary: { light: "#94aa5f", dark: "#060703" },

  // Chosen semantic levels
  error: { light: "#D94A4A", dark: "#C16565" }, // error4
  warning: { light: "#FFE066", dark: "#8A763D" }, // warning3
  danger: { light: "#FFAB66", dark: "#8A4C30" }, // danger3
  success: { light: "#4F9E4F", dark: "#6BAF6B" }, // success4

  // Info candidates (pick later)
  info1: { light: "#E6F4FA", dark: "#1C2A32" },
  info2: { light: "#B9E0F2", dark: "#294356" },
  info3: { light: "#7FC3E0", dark: "#3C637C" },
  info4: { light: "#3A91B9", dark: "#5FA8C7" },
  info5: { light: "#1F5C75", dark: "#92C9E0" },
} as const;

export const mintTheme = buildThemes(config);

// Optional: handy type for <Theme name="...">
export type AppThemeName =
  | `light_${keyof typeof config & string}`
  | `dark_${keyof typeof config & string}`;

/*export const THEME_ERROR = "error4";
export const THEME_WARNING = "warning3";
export const THEME_DANGER = "danger3";
export const THEME_SUCCESS = "success4";

    accent1: { light: "#EA580C", dark: "#FB923C" }, // burnt orange
  accent2: { light: "#E11D48", dark: "#FB7185" }, // crimson
  accent3: { light: "#9d1432", dark: "#608f39" },
  */
