import { Theme } from '@/types';
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

  // Status colors
  error: '#D32F2F', // A standard error red
  success: '#388E3C', // A standard success green
  info: '#1976D2', // A standard info blue
};

export const lightTheme: Theme = {
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    background: palette.white,
    card: palette.lightGrey,
    text: palette.black,
    textSecondary: palette.darkGrey,
    border: palette.grey,
    error: palette.error,
    success: palette.success,
    info: palette.info,
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
    error: palette.error,
    success: palette.success,
    info: palette.info,
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
