
import { darken, lighten } from '@/utils/helpers';

const primary = 'rgb(119, 131, 161)';
const secondary = 'rgb(247, 177, 163)';
const accent = 'rgb(161, 138, 117)';


const backgroundPrimary = 'rgb(246, 246, 246)';
const backgroundSecondary = 'rgb(255, 255, 255)';

export const COLORS = {
  // Primary palette
  primary: darken(primary, 10),
  secondary: darken(secondary, 10),
  accent: accent,

  // Text colors
  textPrimary: 'rgb(35,35,35)',
  textSecondary: 'rgb(117,117,117)',

  textOnPrimary: lighten(primary, 40),
  textOnSecondary: lighten(secondary, 40),
  textOnAccent: lighten(accent, 40),

  // Backgrounds
  backgroundPrimary: backgroundPrimary,
  backgroundSecondary: backgroundSecondary,

  // Borders and outlines
  border: darken(backgroundSecondary, 10),
};
