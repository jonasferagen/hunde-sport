import { darken } from '@/utils/helpers';

const palette = {
  primary: '#D7C8E7',
  secondary: '#DDE2C3',
  accent: '#C8E6E5',

  white: '#FFFFFF',
  black: '#000000',
  lightGrey: '#F6F6F6',
  grey: '#E8E8E8',
  darkGrey: '#8A8A8A',

  activeRed: '#F47272',
  inactiveBlue: '#9DB2CE',
};

export const lightTheme = {
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    background: palette.white,
    card: palette.lightGrey,
    text: palette.black,
    textSecondary: palette.darkGrey,
    border: palette.grey,
  },
  gradients: {
    primary: [darken(palette.primary, 10), palette.primary],
    secondary: [darken(palette.secondary, 10), palette.secondary],
    accent: [darken(palette.accent, 10), palette.accent],
  },
  tabs: {
    active: palette.activeRed,
    inactive: palette.inactiveBlue,
  },
  textOnColor: {
    primary: darken(palette.primary, 50),
    secondary: darken(palette.secondary, 50),
    accent: darken(palette.accent, 50),
  },
} as const;

export const darkTheme: Theme = {
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    background: palette.black,
    card: darken(palette.black, -10), // A slightly lighter black
    text: palette.white,
    textSecondary: palette.lightGrey,
    border: darken(palette.black, -20),
  },
  gradients: {
    primary: [darken(palette.primary, 10), palette.primary],
    secondary: [darken(palette.secondary, 10), palette.secondary],
    accent: [darken(palette.accent, 10), palette.accent],
  },
  tabs: {
    active: palette.activeRed,
    inactive: palette.inactiveBlue,
  },
  textOnColor: {
    primary: palette.white,
    secondary: palette.white,
    accent: palette.white,
  },
} as const;

export type Theme = typeof lightTheme;

// We will eventually remove this `COLORS` export
// For now, we keep it for a smoother transition.
export const COLORS = {
  ...lightTheme.colors,
  ...lightTheme.gradients,
  ...lightTheme.tabs,
  textOnPrimary: lightTheme.textOnColor.primary,
  textOnSecondary: lightTheme.textOnColor.secondary,
  textOnAccent: lightTheme.textOnColor.accent,
  gradientPrimary: lightTheme.gradients.primary,
  gradientSecondary: lightTheme.gradients.secondary,
  gradientAccent: lightTheme.gradients.accent,
  headerBackground: lightTheme.colors.primary,
  searchBarBackground: lightTheme.colors.card,
  categoryCardBackground: lightTheme.colors.secondary,
  productCardBackground: lightTheme.colors.accent,
  activeTab: lightTheme.tabs.active,
  inactiveTab: lightTheme.tabs.inactive,
  text: lightTheme.colors.text,
  textLight: lightTheme.colors.textSecondary,
  border: lightTheme.colors.border,
  white: palette.white,
  black: palette.black,
  grey: palette.grey,
  lightGrey: palette.lightGrey,
  darkGrey: palette.darkGrey,
};
