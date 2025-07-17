import { _Theme, Theme } from '@/types';
import { darken, lighten } from '@/utils/helpers';

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
    default: palette.white,
    card: darken(palette.white, 10),
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
    default: [darken(palette.white, 10), palette.white],
  },
  tabs: {
    active: palette.activeRed,
    inactive: palette.inactiveBlue,
  },
  textOnColor: {
    primary: darken(palette.primary, 50),
    secondary: darken(palette.secondary, 50),
    accent: darken(palette.accent, 50),
    default: palette.darkGrey,
  },
  styles: {
    disabled: {
      opacity: 0.5,
    },
    shadow: {
      shadowColor: palette.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
} as const;

export const darkTheme: Theme = {
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    default: palette.black,

    card: darken(palette.black, -10), // A slightly lighter black
    text: palette.white,
    textSecondary: palette.lightGrey,
    border: darken(palette.black, -20),
    error: palette.error,
    success: palette.success,
    info: palette.info,
  },
  gradients: {
    primary: [lighten(palette.primary, 10), palette.primary],
    secondary: [lighten(palette.secondary, 10), palette.secondary],
    accent: [lighten(palette.accent, 10), palette.accent],
    default: [lighten(palette.black, 10), palette.black],
  },
  tabs: {
    active: palette.activeRed,
    inactive: palette.inactiveBlue,
  },
  textOnColor: {
    primary: palette.white,
    secondary: palette.white,
    accent: palette.white,
    default: palette.white,
  },
  styles: {
    disabled: {
      opacity: 0.5,
    },
    shadow: {
      shadowColor: palette.white,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
} as const;


export const _theme: _Theme = {
  primary: {
    backgroundColor: palette.primary,
    color: darken(palette.primary, 50),
    borderColor: darken(palette.primary, 10),
  },
  secondary: {
    backgroundColor: palette.secondary,
    color: darken(palette.secondary, 50),
    borderColor: darken(palette.secondary, 10),
  },
  accent: {
    backgroundColor: palette.accent,
    color: darken(palette.accent, 50),
    borderColor: darken(palette.accent, 10),
  },
  default: {
    backgroundColor: palette.white,
    color: palette.black,
    borderColor: darken(palette.grey, 10),
  },
}