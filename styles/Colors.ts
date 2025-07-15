import { darken, lighten } from '@/utils/helpers';

const purple = '#D7C8E7'; // Header background from image
const olive = '#DDE2C3'; // Category card background from image
const teal = '#C8E6E5'; // Product card background from image
const white = '#FFFFFF';
const black = '#000000';
const lightGrey = '#F6F6F6'; // Search bar background
const grey = '#E8E8E8';
const darkGrey = '#8A8A8A';
const activeRed = '#F47272';
const inactiveBlue = '#9DB2CE';

const primary = purple;
const secondary = olive;
const accent = teal;

const backgroundPrimary = lighten(primary, 5); // Lighter shade for backgrounds
const backgroundSecondary = white;
const backgroundAccent = lighten(accent, 5);

const backgroundPrimaryBorder = darken(backgroundPrimary, 10);
const backgroundSecondaryBorder = darken(backgroundSecondary, 10);
const backgroundAccentBorder = darken(backgroundAccent, 10);

const gradientPrimary = [darken(primary, 10), secondary] as const;
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
  textOnPrimary: lighten(primary, 10),
  textOnSecondary: darken(secondary, 50),
  textOnAccent: darken(accent, 50),
  textLight: darkGrey,

  // Backgrounds
  backgroundPrimary,
  backgroundSecondary,
  backgroundAccent,

  // Background borders
  backgroundPrimaryBorder,
  backgroundSecondaryBorder,
  backgroundAccentBorder,

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
