import { StyleVariant } from '@/types';
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



export class ThemeManager {
  public static palette = palette;

  private readonly variants: Record<'primary' | 'secondary' | 'accent' | 'default' | 'card', StyleVariant>;
  private readonly alerts: Record<'info' | 'success' | 'error', StyleVariant>;

  constructor() {
    this.variants = {
      primary: {
        backgroundColor: ThemeManager.palette.primary,
        text: {
          primary: darken(ThemeManager.palette.primary, 50),
          secondary: darken(ThemeManager.palette.primary, 30),
        },
        borderColor: darken(ThemeManager.palette.primary, 20),
      },
      secondary: {
        backgroundColor: ThemeManager.palette.secondary,
        text: {
          primary: darken(ThemeManager.palette.secondary, 50),
          secondary: darken(ThemeManager.palette.secondary, 30),
        },
        borderColor: darken(ThemeManager.palette.secondary, 20),
      },
      accent: {
        backgroundColor: ThemeManager.palette.accent,
        text: {
          primary: darken(ThemeManager.palette.accent, 50),
          secondary: darken(ThemeManager.palette.accent, 30),
        },
        borderColor: darken(ThemeManager.palette.accent, 20),
      },
      default: {
        backgroundColor: ThemeManager.palette.white,
        text: {
          primary: ThemeManager.palette.black,
          secondary: ThemeManager.palette.darkGrey,
        },
        borderColor: darken(ThemeManager.palette.grey, 20),
      },
      card: {
        backgroundColor: ThemeManager.palette.grey,
        text: {
          primary: ThemeManager.palette.darkGrey,
          secondary: ThemeManager.palette.grey,
        },
        borderColor: ThemeManager.palette.grey,
      },
    };

    this.alerts = {
      info: {
        backgroundColor: ThemeManager.palette.info,
        text: {
          primary: palette.white,
          secondary: darken(palette.white, 20),
        },
        borderColor: darken(ThemeManager.palette.info, 20),
      },
      success: {
        backgroundColor: ThemeManager.palette.success,
        text: {
          primary: palette.white,
          secondary: darken(palette.white, 20),
        },
        borderColor: darken(ThemeManager.palette.success, 20),
      },
      error: {
        backgroundColor: ThemeManager.palette.error,
        text: {
          primary: palette.white,
          secondary: darken(palette.white, 20),
        },
        borderColor: darken(ThemeManager.palette.error, 20),
      },
    };
  }

  public getVariant(variant: keyof typeof this.variants): StyleVariant {
    return this.variants[variant];
  }

  public getAlert(variant: keyof typeof this.alerts): StyleVariant {
    return this.alerts[variant];
  }
}

export const themeManager = new ThemeManager();