
import { darken, lighten } from '@/utils/helpers';

const primary = '#d5a5d7';
const secondary = '#d7d5a5';
const accent = '#a5d7d5';

const backgroundPrimary = lighten(primary, 20)
const backgroundSecondary = lighten(secondary, 20)
const backgroundAccent = lighten(accent, 20);

const backgroundPrimaryBorder = darken(backgroundPrimary, 10)
const backgroundSecondaryBorder = darken(backgroundSecondary, 10)
const backgroundAccentBorder = darken(backgroundAccent, 10)

const gradientPrimary = [primary, secondary, accent] as const;

export const COLORS = {
  // Primary palette
  primary,
  secondary,
  accent,
  // Text colors
  textOnPrimary: darken(primary, 50),
  textOnSecondary: darken(secondary, 50),
  textOnAccent: darken(accent, 50),

  // Backgrounds
  backgroundPrimary,
  backgroundSecondary,
  backgroundAccent,

  // Background borders
  backgroundPrimaryBorder,
  backgroundSecondaryBorder,
  backgroundAccentBorder,

  // Borders and outlines
  border: darken(backgroundSecondary, 10),
  gradientPrimary
};
