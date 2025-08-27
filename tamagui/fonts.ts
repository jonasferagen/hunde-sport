// fonts.ts
import { createFont } from "tamagui";

// Same base size scale Tamagui uses (includes 1–16 + `true` alias)
const baseSizes = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  true: 14 as const, // alias used by some components
  5: 16,
  6: 18,
  7: 20,
  8: 23,
  9: 30,
  10: 46,
  11: 55,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 134,
} as const;

// Simple line-height function (what the Inter preset does by default)
const makeLineHeights = (sizes: Record<number, number>) =>
  Object.fromEntries(
    Object.entries(sizes).map(([k, v]) => [k, (v as number) + 10])
  ) as Record<keyof typeof sizes, number>;
export const systemFont = createFont({
  family: "System", // <- resolves to SF on iOS, Roboto on Android
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 23,
    9: 30,
    10: 46,
    11: 55,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
  },
  lineHeight: {
    1: 21,
    2: 22,
    3: 23,
    4: 24,
    5: 26,
    6: 28,
    7: 30,
    8: 33,
    9: 40,
    10: 56,
    11: 65,
    12: 72,
    13: 82,
    14: 102,
    15: 124,
    16: 144,
  },
  weight: {
    1: "400",
    6: "700",
  },
});

export const montserratFont = createFont({
  family: "Montserrat",
  size: baseSizes,
  lineHeight: makeLineHeights(baseSizes),
  weight: {
    1: "400",
    2: "400",
    3: "400",
    4: "400",
    5: "400",
    6: "400",
    7: "400",
    8: "400",
    9: "400",
    10: "400",
    11: "700",
    12: "700",
    13: "700",
    14: "700",
    15: "700",
    16: "700",
  },
  face: {
    400: { normal: "Montserrat" },
    700: { normal: "Montserrat-Bold" },
    bold: { normal: "Montserrat-Bold" },
  },
});
