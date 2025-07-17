import { StyleVariant, Theme } from '@/types';
import { darken } from '@/utils/helpers';

export const palette = {
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

export const theme: Theme = {
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

export class ThemeManager {
  public static palette = palette;
  public static theme = theme;

  public getVariant(variant: 'primary' | 'secondary' | 'accent' | 'default'): StyleVariant {
    if (variant === 'default') {
      return {
        backgroundColor: ThemeManager.palette.white,
        color: ThemeManager.palette.black,
        borderColor: darken(ThemeManager.palette.grey, 10),
      };
    }
    return {
      backgroundColor: ThemeManager.palette[variant],
      color: darken(ThemeManager.palette[variant], 50),
      borderColor: darken(ThemeManager.palette[variant], 10),
    };
  }

  public getAlert(variant: 'info' | 'success' | 'error'): StyleVariant {
    return {
      backgroundColor: ThemeManager.palette[variant],
      color: palette.white,
      borderColor: darken(ThemeManager.palette[variant], 10),
    };
  }
}

export const themeManager = new ThemeManager();