import { darken } from '@/utils/helpers';

const primary = '#D7C8E7'; // Header background from image
const secondary = '#DDE2C3'; // Category card background from image
const accent = '#C8E6E5'; // Product card background from image
const white = '#FFFFFF';
const black = '#000000';
const lightGrey = '#F6F6F6'; // Search bar background
const grey = '#E8E8E8';
const darkGrey = '#8A8A8A';
const activeRed = '#F47272';
const inactiveBlue = '#9DB2CE';

const darkPrimary = darken(primary, 50);
const darkSecondary = darken(secondary, 50);
const darkAccent = darken(accent, 50);

const backgroundPrimary = primary;
const backgroundSecondary = secondary;
const backgroundAccent = accent;

const backgroundPrimaryBorder = darken(backgroundPrimary, 10);
const backgroundSecondaryBorder = darken(backgroundSecondary, 10);
const backgroundAccentBorder = darken(backgroundAccent, 10);

const gradientPrimary = [darken(primary, 10), primary] as const;
const gradientSecondary = [accent, darken(secondary, 10)] as const;
const gradientAccent = [darken(accent, 10), accent] as const;


export const COLORS = {
  // Primary palette
  primary,
  secondary,
  accent,

  // Specific UI elements
  headerBackground: primary,
  searchBarBackground: lightGrey,
  categoryCardBackground: secondary,
  productCardBackground: accent,
  activeTab: activeRed,
  inactiveTab: inactiveBlue,

  // Text colors
  text: black,
  textOnPrimary: darkPrimary,
  textOnSecondary: darkSecondary,
  textOnAccent: darkAccent,
  textLight: darkGrey,

  // Backgrounds
  backgroundPrimary,
  backgroundSecondary,
  backgroundAccent,

  // Background borders
  backgroundPrimaryBorder,
  backgroundSecondaryBorder,
  backgroundAccentBorder,

  // Dark colors
  darkPrimary,
  darkSecondary,
  darkAccent,

  // Borders and outlines
  border: grey,
  gradientPrimary,
  gradientSecondary,
  gradientAccent,

  // Base Colors
  white,
  black,
  grey,
  lightGrey,
  darkGrey,
};
