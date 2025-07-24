import { IStyleVariant, ThemeVariant } from '@/types';
import { darken, lighten } from '@/utils/helpers';
import { ColorValue } from 'react-native';
import { useTheme } from 'tamagui';

const primary = '#D7C8E7';
const secondary = '#DDE2C3';
const accent = '#C8E6E5';

export const palette = {
  primary,
  secondary,
  accent,

  white: '#FFFFFF',
  black: '#000000',
  lightGrey: '#F6F6F6',
  grey: '#E8E8E8',
  darkGrey: '#8A8A8A',


  // Status colors  // D32F2F
  error: darken('#F47272', 10), // A standard error red
  success: '#388E3C', // A standard success green
  info: darken(primary, 30), // A standard info blue
};

export const getThemeColors = (variant: ThemeVariant) => {
  const theme = useTheme();

  const themeColors: Record<ThemeVariant, { bg: string, text: string }> = {
    primary: { bg: theme.primary?.val ?? theme.background.val, text: theme.primaryText?.val ?? theme.color.val },
    secondary: { bg: theme.secondary?.val ?? theme.background.val, text: theme.secondaryText?.val ?? theme.color.val },
    accent: { bg: theme.accent?.val ?? theme.background.val, text: theme.accentText?.val ?? theme.color.val },
    default: { bg: theme.background.val, text: theme.color.val },
  };

  return themeColors[variant];
}

export class StyleVariant implements IStyleVariant {
  public readonly backgroundColor: string;
  public readonly text: {
    readonly primary: string;
    readonly secondary: string;
  };
  public readonly borderColor: string;
  public readonly outlineColor: string;

  constructor(backgroundColor: string, text: { primary: string; secondary: string }, borderColor: string) {
    this.backgroundColor = backgroundColor;
    this.text = text;
    this.borderColor = borderColor;
    this.outlineColor = borderColor;
  }

  getGradient(amounts: number[] = [-10, 10]): [ColorValue, ColorValue] {

    if (amounts.length !== 2) {
      throw new Error('2 amounts for gradient expected');
    }

    return [
      lighten(this.backgroundColor, amounts[0]) as ColorValue,
      lighten(this.backgroundColor, amounts[1]) as ColorValue,
    ];
  }
}


export class ThemeManager {
  public static palette = palette;

  private readonly variants: Record<'primary' | 'secondary' | 'accent' | 'default' | 'card', IStyleVariant>;
  private readonly alerts: Record<'info' | 'success' | 'error', IStyleVariant>;

  constructor() {
    this.variants = {
      primary: new StyleVariant(
        ThemeManager.palette.primary,
        {
          primary: darken(ThemeManager.palette.primary, 50),
          secondary: darken(ThemeManager.palette.primary, 40),
        },
        darken(ThemeManager.palette.primary, 20)
      ),
      secondary: new StyleVariant(
        ThemeManager.palette.secondary,
        {
          primary: darken(ThemeManager.palette.secondary, 70),
          secondary: darken(ThemeManager.palette.secondary, 50),
        },
        darken(ThemeManager.palette.secondary, 20)
      ),
      accent: new StyleVariant(
        ThemeManager.palette.accent,
        {
          primary: darken(ThemeManager.palette.accent, 50),
          secondary: darken(ThemeManager.palette.accent, 30),
        },
        darken(ThemeManager.palette.accent, 20)
      ),
      default: new StyleVariant(
        ThemeManager.palette.white,
        {
          primary: ThemeManager.palette.black,
          secondary: ThemeManager.palette.darkGrey,
        },
        ThemeManager.palette.grey
      ),
      card: new StyleVariant(
        ThemeManager.palette.grey,
        {
          primary: ThemeManager.palette.darkGrey,
          secondary: ThemeManager.palette.grey,
        },
        ThemeManager.palette.grey
      ),
    };

    this.alerts = {
      info: new StyleVariant(
        ThemeManager.palette.info,
        {
          primary: palette.white,
          secondary: darken(palette.white, 20),
        },
        darken(ThemeManager.palette.info, 20)
      ),
      success: new StyleVariant(
        ThemeManager.palette.success,
        {
          primary: palette.white,
          secondary: darken(palette.white, 20),
        },
        darken(ThemeManager.palette.success, 20)
      ),
      error: new StyleVariant(
        ThemeManager.palette.error,
        {
          primary: palette.white,
          secondary: darken(palette.white, 20),
        },
        darken(ThemeManager.palette.error, 20)
      ),
    };
  }

  public getVariant(variant: keyof typeof this.variants): IStyleVariant {
    return this.variants[variant];
  }

  public getAlert(variant: keyof typeof this.alerts): IStyleVariant {
    return this.alerts[variant];
  }
}

export const themeManager = new ThemeManager();