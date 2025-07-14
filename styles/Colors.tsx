
import { darken } from '@/utils/helpers';


const primary = '#d5a5d7';
const secondary = '#d7d5a5';
const accent = '#a5d7d5';

const backgroundPrimary = 'rgb(246, 246, 246)';
const backgroundSecondary = 'rgb(255, 255, 255)';

const gradientPrimary = [primary, secondary, accent] as const;

export const COLORS = {
  // Primary palette
  primary,
  secondary,
  accent,

  // Text colors
  textPrimary: 'rgb(35,35,35)',
  textSecondary: 'rgb(117,117,117)',

  textOnPrimary: darken(primary, 50),
  textOnSecondary: darken(secondary, 50),
  textOnAccent: darken(accent, 50),

  // Backgrounds
  backgroundPrimary: backgroundPrimary,
  backgroundSecondary: backgroundSecondary,

  // Borders and outlines
  border: darken(backgroundSecondary, 10),
  gradientPrimary
};
