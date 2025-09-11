import { type DimensionValue } from "react-native";

export const DOMAIN = "hunde-sport.no" as const;
export const BASE_URL = `https://${DOMAIN}` as const;
export const STORE_URL = `${BASE_URL}/wp-json/wc/store/v1` as const;
export const CHECKOUT_URL = `${BASE_URL}/kassen` as const;

export const NUM_CATEGORY_TILE_COLUMNS = 3;

export const PRODUCT_TILE_WIDTH: DimensionValue = 160;
export const PRODUCT_TILE_HEIGHT: DimensionValue = 120;

/* Needed for popdown/popup upon drawer open/close */
export const BOTTOM_BAR_HEIGHT: DimensionValue = 80;

export const THEME_SHEET = "light";
export const THEME_SHEET_BG1 = "primary";
export const THEME_SHEET_BG2 = "secondary";

export const THEME_HEADER = "primary";
export const THEME_BOTTOM_BAR = "secondary";

export const THEME_HINT = "dark_secondary_shade";

export const THEME_PAGE_HEADER = "primary";
export const THEME_PAGE_FOOTER = "secondary_shade";

export const THEME_CTA_BUY = "dark_secondary";
export const THEME_CTA_UNAVAILABLE = "secondary_tint";
export const THEME_CTA_VIEW = "dark_tertiary_tint";
export const THEME_CTA_SELECTION_NEEDED = "secondary_tint";
export const THEME_CTA_OUTOFSTOCK = "secondary_tint";
export const THEME_CTA_CHECKOUT = "dark_tertiary";

export const THEME_PRICE_TAG = "dark_tertiary";

export const THEME_PRODUCT_ITEM_1 = "secondary";
export const THEME_PRODUCT_ITEM_2 = "secondary_tint";

export const THEME_CART_ITEM_1 = "secondary";
export const THEME_CART_ITEM_2 = "secondary_tint";

export const THEME_OPTION = "light";
export const THEME_OPTION_SELECTED = "dark";

export const THEME_PRODUCTS_RECENT = "light";
export const THEME_PRODUCTS_RECENT_BG = "secondary_tint";

export const THEME_CATEGORIES = "tertiary";
export const THEME_CATEGORIES_BG = "secondary";

export const THEME_PRODUCTS_DISCOUNTED = "light";
export const THEME_PRODUCTS_DISCOUNTED_BG = "secondary_tint";

export const THEME_PRODUCTS_FEATURED = "light";
export const THEME_PRODUCTS_FEATURED_BG = "secondary";
