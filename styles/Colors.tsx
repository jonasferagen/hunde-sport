
import { darken, lighten } from '@/utils/helpers';

const primary = 'rgb(247, 177, 163)';
const secondary = 'rgb(119, 131, 161)';
const accent = 'rgb(161, 138, 117)';

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
  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f6f6f6',

  // Borders and outlines
  border: '#E0E0E0',
};

